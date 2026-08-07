-- Script de Contador de Tempo para OBS
obs = obslua

-- Variáveis globais
local timer_active = false
local timer_paused = false
local timer_value = 0
local initial_time = 0
local timer_text = ""
local settings_table = {}

-- Função para definir o texto do temporizador
function set_time_text()
    local hours = math.floor(timer_value / 3600)
    local minutes = math.floor((timer_value % 3600) / 60)
    local seconds = math.floor(timer_value % 60)
    
    timer_text = string.format("%02d:%02d:%02d", hours, minutes, seconds)
    
    local source = obs.obs_get_source_by_name(settings_table.text_source)
    if source ~= nil then
        local settings = obs.obs_data_create()
        obs.obs_data_set_string(settings, "text", timer_text)
        obs.obs_source_update(source, settings)
        obs.obs_data_release(settings)
        obs.obs_source_release(source)
    end
end

-- Função chamada a cada segundo
function timer_callback()
    if timer_active and not timer_paused then
        if settings_table.countdown then
            timer_value = timer_value - 1
            if timer_value < 0 then
                timer_value = 0
                timer_active = false
            end
        else
            timer_value = timer_value + 1
        end
        set_time_text()
    end
end

-- Função para iniciar o temporizador
function start_timer()
    timer_active = true
    timer_paused = false
end

-- Função para pausar o temporizador
function pause_timer()
    timer_paused = true
end

-- Função para retomar o temporizador
function resume_timer()
    timer_paused = false
end

-- Função para parar o temporizador
function stop_timer()
    timer_active = false
    timer_paused = false
    timer_value = initial_time
    set_time_text()
end

-- Função para resetar o temporizador
function reset_timer()
    timer_value = initial_time
    set_time_text()
end

-- Callbacks de eventos do script
function script_description()
    return "Contador de tempo simples para OBS.\n\nCriado por: Guilherme Favaron"
end

function script_properties()
    local props = obs.obs_properties_create()
    
    -- Adiciona campo para fonte de texto
    obs.obs_properties_add_list(props, "text_source", "Fonte de Texto", 
        obs.OBS_COMBO_TYPE_EDITABLE, obs.OBS_COMBO_FORMAT_STRING)
        
    -- Adiciona campos para tempo inicial
    obs.obs_properties_add_int(props, "hours", "Horas", 0, 23, 1)
    obs.obs_properties_add_int(props, "minutes", "Minutos", 0, 59, 1)
    obs.obs_properties_add_int(props, "seconds", "Segundos", 0, 59, 1)
    
    -- Adiciona opção de contagem regressiva
    obs.obs_properties_add_bool(props, "countdown", "Contagem Regressiva")
    
    -- Adiciona botões de controle
    obs.obs_properties_add_button(props, "start_button", "Iniciar", start_timer)
    obs.obs_properties_add_button(props, "pause_button", "Pausar", pause_timer)
    obs.obs_properties_add_button(props, "resume_button", "Retomar", resume_timer)
    obs.obs_properties_add_button(props, "stop_button", "Parar", stop_timer)
    obs.obs_properties_add_button(props, "reset_button", "Resetar", reset_timer)
    
    return props
end

function script_update(settings)
    settings_table.text_source = obs.obs_data_get_string(settings, "text_source")
    settings_table.countdown = obs.obs_data_get_bool(settings, "countdown")
    
    local hours = obs.obs_data_get_int(settings, "hours")
    local minutes = obs.obs_data_get_int(settings, "minutes")
    local seconds = obs.obs_data_get_int(settings, "seconds")
    
    initial_time = hours * 3600 + minutes * 60 + seconds
    if not timer_active then
        timer_value = initial_time
        set_time_text()
    end
end

function script_defaults(settings)
    obs.obs_data_set_default_bool(settings, "countdown", false)
    obs.obs_data_set_default_int(settings, "hours", 0)
    obs.obs_data_set_default_int(settings, "minutes", 0)
    obs.obs_data_set_default_int(settings, "seconds", 0)
end

function script_load(settings)
    obs.timer_add(timer_callback, 1000)
end

function script_unload()
    obs.timer_remove(timer_callback)
end