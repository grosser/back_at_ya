(function() {
  return {
    requests: {
      rate: function(data, user_id) {
        return {
          url: helpers.fmt('/api/v2/users/%@.json', user_id),
          dataType: 'JSON',
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(data)
        };
      }
    },

    events: {
      'app.activated': 'init'
    },

    init: function() {
      this.switchTo('form');
      this.rateit(this.$, this.currentUser().id().customField("agent_satisfaction_average"));
    },

    rateit: function($, current){
      var jQuery = $;
      var self = this;

      var rating = function(container) {
        var settings = {
          maxvalue  : 5,   // max number of stars
          curvalue  : Math.round(current || 0),    // number of selected stars
          cancel: true
        };

        container.averageRating = settings.curvalue;

        for(var i= 0; i <= settings.maxvalue ; i++){
          var div;
          var size = i;
          if (i === 0) {
            if(settings.cancel === true){
              div = '<div class="cancel"><a href="#0" title="Cancel Rating">Cancel Rating</a></div>';
              container.append(div);
            }
          }
          else {
            div = '<div class="star"><a href="#'+i+'" title="Give it '+i+'/'+size+'">'+i+'</a></div>';
            container.append(div);
          }
        }

        var stars = container.children('.star');
        var cancel = container.children('.cancel');

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
          if(settings.cancel === true){
            settings.curvalue = stars.index(this) + 1;
            var rating = jQuery(this).children('a')[0].href.split('#')[1];
            self.submitRating(rating);
            return false;
          }
          return true;
        });

        // cancel button events
        if(cancel){
          cancel
            .mouseover(function(){
              event.drain();
              jQuery(this).addClass('on');
            })
            .mouseout(function(){
              event.reset();
              jQuery(this).removeClass('on');
            })
            .focus(function(){
              event.drain();
              jQuery(this).addClass('on');
            })
            .blur(function(){
              event.reset();
              jQuery(this).removeClass('on');
            });

          // click events.
          cancel.click(function(){
            event.drain();
            settings.curvalue = 0;
            console.log("--->", {"rating": jQuery(this).children('a')[0].href.split('#')[1]});
            return false;
          });
        }

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

        return(this);
      };
      rating($(".rating"));
    },

    submitRating: function(rating){
      var mine = ";" + this.currentUser().id() + "," + this.ticket().id() + ",";
      var ratings = (this.currentUser().customField("agent_satisfaction") || "").replace(new RegExp(mine + "\\d"), "");
      ratings += mine + rating;
      var average = this.average(ratings);

      console.log("---> ratings", ratings, average);
//      var ticket_id = this.ticket().id();
//      var data = { "user": { "custom_fields": { "agent_satisfaction": ratings, "agent_satisfaction_average": average } } };
      this.currentUser().customField("agent_satisfaction", ratings);
      this.currentUser().customField("agent_satisfaction_average", average);
//      this._handleRequests([this.ajax('rate', data, this.currentUser().id())]);
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

    _handleRequests: function(requests) {
      this.when.apply(this, requests).done(_.bind(function(){
          this.notifySuccess();
        }, this))
        .fail(_.bind(function(){
          this.notifyFail();
        }, this));
    },

    notifySuccess: function() {
      services.notify(this.I18n.t('rate_success'));
    },

    notifyFail: function() {
      services.notify(this.I18n.t('rate_error_request'), 'error');
    }
  };
}());
