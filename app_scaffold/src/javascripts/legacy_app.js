import BaseApp from "base_app";

// add these if needed
// import Base64 from 'base64';
// import helpers from 'helpers';

var requests = {
  load: function(user_id) {
    return {
      url: '/api/v2/users/' + user_id + '.json',
      dataType: 'JSON',
      type: 'GET',
      contentType: 'application/json'
    };
  },
  save: function(user_id, data) {
    return {
      url: '/api/v2/users/' + user_id + '.json',
      dataType: 'JSON',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data)
    };
  },
  many: function(user_ids){
    return {
      url: '/api/v2/users/show_many.json?ids=' + user_ids + '.json',
      dataType: 'JSON',
      type: 'GET',
      contentType: 'application/json'
    };
  }
};

var App = {
  defaultState: "loading",

  events: {
    "app.activated": "init",
    // 'click .list_ratings': 'list'
  },

  async init() {
    const client = ZAFClient.init();
    const response = await client.get('ticket.requester')
    if(response['ticket.requester']) {
      client.request(requests.load(response['ticket.requester'].id)).then(function(data) {
        this.switchTo("main");
        if(data.user.user_fields.agent_satisfaction !== undefined && data.user.user_fields.agent_satisfaction_average !== undefined){
          this.requester = data.user;
          this.rateit(this.$);
        } else {
          this.switchTo("error", {error: "<h3>Error</h3>You must add <b>text agent_satisfaction</b> and <b>decimal agent_satisfaction_average</b> user fields."});
        }
      });
    } else {
      this.switchTo("error", {error: "NO REQUESTER"});
    }
  }
};

export default BaseApp.extend(App);
