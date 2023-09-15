# Thunderbird Plugin to convert mails to tasks

## How to install XPI

Download XPI file from releases page and install it in Thunderbird.

Then, install Everdo TLS certificate into Thunderbird.

To do this go to the Thunderbird Preferences, then "Privacy and Security" tab, all the way down is button "Manage Certificates..." press it and select tab "Servers". Finally, press button "Add Exception...". You should enter Everdo URL, then "Get Certificate", and finally "Confirm Security Exception".

Go to plugin preferences and insert Everdo API URL and Key, then click Save.

That's it.

## How to develop & debug this extension

To develop & debug this extension you should prepare development environment. It's easy:

1. Clone repository somewhere

2. Start Thundebird

3. Open Add-ons Manager in Thunderbird

4. Click on wheel in the upper right corner and select option "Debug Add-ons"

5. In the new tab use option "Load Temporary Add-on.." to load plugin you want to debug. Note that you should select manifest.json file

6. Open Error Console in Tools -> Developer Tools.



