:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

# Back@Ya ![Logo](https://dl.dropboxusercontent.com/u/2670385/Web/asat-logo.png)

### Install Back@Ya to allow your agents to rate your customers

### Rate customers for any purpose you choose:
 - Measure agent satisfaction by ticket and build an average agent satisfaction score by individual customer
 - Report (in Good Data) on agent satisfaction rating by customer and compare to their account
 - Route negative customer interactions to speciality agents to try and improve their support experience
 - Build custom workflows around customers with low or high agent satisfaction scores
 - Identify evangelists through high agent satisfaction scores

### Demo

Unrated view, see average of other agents:<br/>
![I18n](https://dl.dropboxusercontent.com/u/2670385/Web/asat-unrated.png)

Rated view, see your rating and average:<br/>
![Screenshot](https://dl.dropboxusercontent.com/u/2670385/Web/asat.png)

See ratings of other agents:<br/>
![I18n](https://dl.dropboxusercontent.com/u/2670385/Web/asat-list.png)

Translated in 12 languages:<br/>
![I18n](https://dl.dropboxusercontent.com/u/2670385/Web/asat-i18n.png)

Error message when misconfigured:<br/>
![Error](https://dl.dropboxusercontent.com/u/2670385/Web/asat-error.png)

### Install

Within your Zendesk account (where you are an admin):

 - Download .zip file from http://tinyurl.com/asatapp
 - Click the gear symbol in the lower left corner
 - Under the Apps menu, select Manage Apps
 - Click on Upload App
 - Upload .zip file as a new App
 - Create Custom User Fields:
     - agent_satisfaction (text)
     - agent_satisfaction_average (decimal)

### After Installation

Rating a customer for the first time

 - go to a ticket page
 - From within a ticket, select a rating (from 1 to 5 stars) based on your interaction with the customer
 - Press the eye of the tiger button to keep motivated for extra awesome customer service.

After a Customer has been rated you will see an agent average and the list of all agents that rated this customer.

Ratings are stored in the user field agent_satisfaction and rating average is stored in agent_satisfaction_average (for views, triggers, reporting).
Yellow stars represent the average rating by fellow agents. Green stars represent what you have rated this customer on this ticket.
Select “# of Ratings” to see tickets numbers for all ratings this Customer has received.
Use “Agent Satisfaction Average” via Good Data to leverage for reporting

## App location:

* Ticket sidebar
