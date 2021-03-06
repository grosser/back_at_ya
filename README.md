:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

# Back@Ya ![Logo](github/logo.png?raw=true)

### Install Back@Ya to allow your agents to rate your customers

### Rate customers for any purpose you choose:
 - Measure agent satisfaction by ticket and build an average agent satisfaction score by individual customer
 - Report (in Good Data) on agent satisfaction rating by customer and compare to their account
 - Route negative customer interactions to speciality agents to try and improve their support experience
 - Build custom workflows around customers with low or high agent satisfaction scores
 - Identify evangelists through high agent satisfaction scores

### Demo

Unrated view, see average of other agents:<br/>
![I18n](github/unrated.png?raw=true)

Rated view, see your rating and average:<br/>
![Screenshot](github/rating.png?raw=true)

See ratings of other agents:<br/>
![I18n](github/list.png?raw=true)

Translated in 12 languages:<br/>
![I18n](github/i18n.png?raw=true)

Error message when misconfigured:<br/>
![Error](github/error.png?raw=true)

### Install

Within your Zendesk account (where you are an admin):

 - [Download .zip file](https://github.com/grosser/back_at_ya/raw/master/back_at_ya.zip)
 - Click the gear symbol in the lower left corner
 - Under the Apps menu, select Manage Apps
 - Click on Upload App
 - Upload .zip file as a new App
 - Create Custom User Fields:
     - agent_satisfaction (text)
     - agent_satisfaction_average (decimal)

### After Installation

Rating a customer for the first time:

 - Open a ticket and you'll see the app in the right sidebar
 - Select a rating (from 1 to 5 stars) based on your interaction with the customer (green stars)
 - After a customer has been rated at least once, you'll see an agent average (yellow stars) and have the ability to see a list of all the agents that have rated this customer
 - If your agents have questions on how to use this app, simple access documentation in the app via the question mark and a hover menu will pop up

Reporting on Back@Ya:

 - Select “# of Ratings” to see tickets numbers and agents for all ratings this customer has received
 - Use “Agent Satisfaction Average” via Good Data to leverage for reporting
 - Ratings are stored in two user fields which can be used in business rules and with views: agent_satisfaction and rating average is stored in agent_satisfaction_average

### App location:

* Ticket sidebar

### Development

 - install [zat](https://developer.zendesk.com/apps/docs/agent/tools) via `gem i zendesk_apps_tools`
 - `webpack --watch` + `zat server --path dist` + `?zat=true` to try out locally hosted version 
 - `zat package --path dist && mv dist/tmp/*.zip back_at_ya.zip` to make a new release

### TODO:
 - notifications when requests fail
 - cleanup
 - more idematic v2 code
 - figure out why default resize did not work
 - remove redundant code from index.js
 - show that ratings are loading with an indicator
 - get tests running maybe for basic math
