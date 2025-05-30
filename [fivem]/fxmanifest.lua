fx_version 'cerulean'
game 'gta5'

author 'Teezy Core Developments'
description 'FiveM NUI Boilerplate with React, TypeScript, and TailwindCSS'
version '1.0.0'

client_scripts {
    'client/*.lua'
}

server_scripts {
    'server/*.lua'
}

ui_page 'web/index.html'
files {
    'web/**/*'
}

lua54 'yes'