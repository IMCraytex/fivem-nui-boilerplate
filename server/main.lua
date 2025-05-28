-- Enable debugging mode (set to false in production)
local debugMode = true

-- Debug print function that only works when debug mode is enabled
local function debugPrint(...)
    if debugMode then
        print('^2[NUI Boilerplate]^7', ...)
    end
end

-- Server initialization
debugPrint("Server script initialized")

-- Example of handling a client request
RegisterServerEvent('nui:getServerData')
AddEventHandler('nui:getServerData', function()
    local source = source
    -- Example data to send back to client
    local data = {
        serverTime = os.time(),
        playerName = GetPlayerName(source),
        playerId = source,
        playerCount = GetNumPlayerIndices()
    }
    
    debugPrint("Sending server data to player " .. source)
    
    -- Send the data back to the client
    TriggerClientEvent('nui:receiveServerData', source, data)
end)
