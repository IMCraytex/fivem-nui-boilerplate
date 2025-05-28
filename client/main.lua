-- Enable debugging mode (set to false in production)
local debugMode = true

-- Display/hide NUI
local display = false

-- Debug print function that only works when debug mode is enabled
local function debugPrint(...)
    if debugMode then
        print('[NUI Boilerplate]', ...)
    end
end

-- Register key mapping to toggle UI
RegisterCommand('toggleui', function()
    SetDisplay(not display)
end, false)

-- You can also use this to register a keybind
RegisterKeyMapping('toggleui', 'Toggle NUI', 'keyboard', 'f1')

-- Function to show/hide NUI
function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool
    })
    
    debugPrint('UI visibility set to: ' .. tostring(bool))
end

-- NUI Callback example
RegisterNUICallback('close', function(data, cb)
    debugPrint('Close UI requested from NUI')
    SetDisplay(false)
    cb({status = 'ok'})
end)

-- Example of sending data to the NUI
RegisterNUICallback('getServerData', function(data, cb)
    -- You can trigger server events here to get data
    TriggerServerEvent('nui:getServerData')
    -- Always call the callback to prevent UI from hanging
    cb({
        status = 'ok',
        message = 'Request sent to server'
    })
end)

-- Receiving data from server
RegisterNetEvent('nui:receiveServerData')
AddEventHandler('nui:receiveServerData', function(data)
    SendNUIMessage({
        type = "serverData",
        data = data
    })
end)

function ShowUIComponent(componentId, data)
    SendNUIMessage({
        type = "component",
        componentId = componentId,
        action = "show",
        data = data
    })
    -- Set focus if needed (you might want to make this configurable per component)
    SetNuiFocus(true, true)
    debugPrint('Showing UI component: ' .. componentId)
end

-- Function to hide a specific UI component
function HideUIComponent(componentId)
    SendNUIMessage({
        type = "component",
        componentId = componentId,
        action = "hide"
    })
    -- You might want to decide whether to remove focus based on other visible components
    -- For simplicity, this example removes focus when hiding any component
    SetNuiFocus(false, false)
    debugPrint('Hiding UI component: ' .. componentId)
end

-- Function to update data for a specific UI component without changing visibility
function UpdateUIComponent(componentId, data)
    SendNUIMessage({
        type = "component",
        componentId = componentId,
        action = "update",
        data = data
    })
    debugPrint('Updating UI component: ' .. componentId)
end

-- Example: Command to show the inventory
RegisterCommand('inventory', function()
    local items = {
        {id = 1, name = "Water Bottle", quantity = 3},
        {id = 2, name = "Bread", quantity = 1},
        {id = 3, name = "Bandage", quantity = 5}
    }
    ShowUIComponent('inventory', {items = items, cash = 500})
end, false)

-- Example: Command to show a notification
RegisterCommand('notify', function(source, args)
    local message = table.concat(args, " ")
    ShowUIComponent('notification', {
        message = message or "Test notification",
        type = "info",
        duration = 3000 -- ms
    })
    -- Auto-hide after duration
    Citizen.SetTimeout(3000, function()
        HideUIComponent('notification')
    end)
end, false)
