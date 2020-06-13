# Thunderbird Plugin to convert mails to tasks

## How to Install

This is pre-alpha code. There's no XPI for the time being. To install this plugin do the following:

1. Clone repository somewhere to your disk

2. Edit background.js file and change the first two lines. You have to put your own Everdo API key and URL

3. Import Everdo certificate used for TLS connection into Thunderbird trust store

To do this go to the Thunderbird Preferences, then "Privacy and Security" tab, all the way down is button "Manage Certificates..." press it and select tab "Servers". Finally, press button "Add Exception...". You should enter Everdo URL, then "Get Certificate", and finally "Confirm Security Exception".

4. Load plugin into Thunderbird

Go to Tools in the hamburger menu, then "Developer Tools" and then "Debug Add-ons". Then, select "Load Temporary Add-on...". In the dialog box navigate to directory with the sources from repository and select manifest.json file.

That's it.
