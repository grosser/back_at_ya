(function() {
  return {
    requests: {
      load: function(user_id) {
        return {
          url: helpers.fmt('/api/v2/users/%@.json', user_id),
          dataType: 'JSON',
          type: 'GET',
          contentType: 'application/json'
        };
      },
      save: function(user_id, data) {
        return {
          url: helpers.fmt('/api/v2/users/%@.json', user_id),
          dataType: 'JSON',
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(data)
        };
      },
      many: function(user_ids){
        return {
          url: helpers.fmt('/api/v2/users/show_many.json?ids=%@', user_ids),
          dataType: 'JSON',
          type: 'GET',
          contentType: 'application/json'
        };
      }
    },

    events: {
      'app.activated': 'init',
      'click .faq': 'faq',
      'click .list_ratings': 'list'
    },

    init: function() {
      var requester = this.ticket().requester();
      this.$(".heading").html(this.I18n.t("rate_requester") + requester.name());

      if(requester){
        this.loading(this.$(".rating"));
        this._handleRequest(this.ajax('load', requester.id()), function(data){
          this.switchTo('form');
          if(data.user.user_fields.agent_satisfaction !== undefined && data.user.user_fields.agent_satisfaction_average !== undefined){
            this.requester = data.user;
            this.rateit(this.$);
          } else {
            this.$(".rating").hide();
            this.$(".field_error").show();
          }
        }, this.notifyFail);
      } else {
        alert("TODO NO REQUESTER");
      }
    },

    // toggle the faq page
    faq: function(){
      this.$(".form, .faq_content").toggle();
    },

    list: function(){
      this.showingList = !this.showingList;
      var dom = this.$(".rating_list");
      dom.toggle(this.showingList);
      if(this.showingList){
        // show loading
        this.loading(dom);

        // get ids of all raters
        var ratings = this.ratings.replace(";", "").split(";");
        var ids = [];
        for(var x = 0; x < ratings.length; x ++) {
          ids.push(ratings[x].split(",")[0]);
        }

        // fetch these users and build html
        var user, values;
        var list = "<table><tr>";
        list += "<th>"+this.I18n.t("heading_ticket") + "</th>";
        list += "<th>"+this.I18n.t("heading_agent")+"</th>";
        list += "<th>"+this.I18n.t("heading_rating")+"</th></tr>";
        this._handleRequest(this.ajax('many', ids.join(",")), function(data){
          for(var x = 0; x < ratings.length; x ++) {
            for(var y = 0; y < data.users.length; y ++) {
              user = data.users[y];
              values = ratings[x].split(",");
              if(user.id === parseInt(values[0], 10)){
                // link to ticket + link to user + rating
                list += "<tr>";
                list += "<td><a href='/agent/#/tickets/"+values[1]+"'>#"+values[1]+"</a></td>";
                list += "<td><a href='/agent/#/users/"+values[0]+"'>"+user.name+"</a></td>";
                list += "<td>" + values[2] +"</td>";
                list += "</tr>";
              }
            }
          }
          list += "</table>";

          // fill list
          dom.html(list);
        }, this.notifyFail);
      }
    },

    loading: function(dom){
      dom.html("<img src='/images/loading.gif'/>");
    },

    rateit: function($){
      var jQuery = $;
      var self = this;
      var current = this.requester.user_fields.agent_satisfaction_average || 0;
      this.ratings = (this.requester.user_fields.agent_satisfaction || "");
      var container = $(".rating");
      this.updateAverage(this.ratings, current);

      // show my rating if I have rated
      var match = this.ratings.match(new RegExp(this.mine() + "(\\d)"));
      if(match){
        current = parseInt(match[1], 10);
        container.addClass("mine");
      }

      // Rest
      var settings = {
        maxvalue  : 5,   // max number of stars
        curvalue  : Math.round(current || 0) // number of selected stars
      };

      container.averageRating = settings.curvalue;

      for(var i= 1; i <= settings.maxvalue ; i++){
        var div;
        var size = i;
        div = '<div class="star"><a href="#'+i+'" title="'+ this.I18n.t("give_it_stars") +i+'/'+size+'">'+i+'</a></div>';
        container.append(div);
      }

      var stars = container.children('.star');

      stars
        .mouseover(function(){
          event.drain();
          event.fill(this);
        })
        .mouseout(function(){
          event.drain();
          event.reset();
        })
        .focus(function(){
          event.drain();
          event.fill(this);
        })
        .blur(function(){
          event.drain();
          event.reset();
        });

      stars.click(function(){
        settings.curvalue = stars.index(this) + 1;
        var rating = jQuery(this).children('a')[0].href.split('#')[1];
        self.submitRating(rating);
        container.addClass("mine");
        return false;
      });

      var event = {
        fill: function(el){ // fill to the current mouse position.
          var index = stars.index(el) + 1;
          stars
            .children('a').css('width', '100%').end()
            .slice(0, index).addClass('hover').end();
        },
        drain: function() { // drain all the stars.
          stars
            .filter('.on').removeClass('on').end()
            .filter('.hover').removeClass('hover').end();
        },
        reset: function(){ // Reset the stars to the default index.
          stars.slice(0, settings.curvalue).addClass('on').end();
        }
      };
      event.reset();
    },

    mine: function(){
      return ";" + this.currentUser().id() + "," + this.ticket().id() + ",";
    },

    updateAverage: function(ratings, average){
      this.$(".average-overview").toggle(average !== 0);
      this.$(".average-first").toggle(average === 0);
      this.$(".average").html(average);
      this.$(".ratings_count").html(ratings.split(";").length - 1);
    },

    submitRating: function(rating){
      if(this.showingList){ this.list(); } // close the list so we do not show inconsistent data

      var mine = this.mine();
      this.ratings = this.ratings.replace(new RegExp(mine + "\\d"), "");
      this.ratings += mine + rating;
      var average = this.average(this.ratings);
      this.updateAverage(this.ratings, average);

      var data = {
        "user": {
          "user_fields": {
            "agent_satisfaction": this.ratings,
            "agent_satisfaction_average": average
          }
        }
      };

      this._handleRequest(this.ajax('save', this.requester.id, data), this.notifySuccess, this.notifyFail);
    },

    average: function(ratings){
      ratings = ratings.replace(";","").split(";");
      var sum = 0;
      var els;
      for(var x = 0; x < ratings.length; x ++) {
        els = ratings[x].split(",");
        sum += parseInt(els[els.length - 1], 10);
      }

      return sum / ratings.length;
    },

    _handleRequest: function(request, success, fail) {
      this.when.apply(this, [request]).done(_.bind(success, this))
        .fail(_.bind(fail, this));
    },

    notifySuccess: function() {
      services.notify(this.I18n.t('rate_success'));
    },

    notifyFail: function() {
      services.notify(this.I18n.t('rate_error_request'), 'error');
    }
  };
}());
