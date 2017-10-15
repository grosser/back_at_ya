import BaseApp from "base_app";

// add these if needed
// import Base64 from 'base64';
// import helpers from 'helpers';

var App = {
  defaultState: "loading",

  requests: {
    getMe: {
      url: "/api/v2/users/me.json"
    }
  },

  events: {
    "app.activated": "init",
    // 'click .list_ratings': 'list'
  },

  async init() {
    const client = ZAFClient.init();
    const response = await client.get('ticket.requester')
    if(response['ticket.requester']) {
      this.switchTo("main");
    } else {
      this.switchTo("error", {error: "NO REQUESTER"});
    }
  }
};

export default BaseApp.extend(App);
