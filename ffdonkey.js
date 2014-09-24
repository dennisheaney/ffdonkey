var Twit = require('twit');

exports = module.exports = {

  run: function () {
    this.twit = new Twit({
      consumer_key:         process.env.TWIT_API_KEY,
      consumer_secret:      process.env.TWIT_API_SECRET,
      access_token:         process.env.TWIT_ACCESS_TOKEN,
      access_token_secret:  process.env.TWIT_ACCESS_TOKEN_SECRET
    });

    this.user = process.env.DONKEY_USER;
    this.list_slug = process.env.DONKEY_LIST_SLUG;

    // let's go
    setInterval(this.publishFriends.bind(this), process.env.TWIT_INTERVAL);
  },

  publishFriends: function () {
    var self = this;
    this.fetchList(function (err, list) {
      err && console.log(err);
      var users = [];
      list && list.forEach(function (user, index) {
        if (Math.floor(Math.random() * list.length) <= index) {
          // randomly ignore some users
          continue;
        }
        users.push('@' + user.screen_name);
      });

      users.length && self.twit.post('status/update', { status: '#ff: ' + users.join(',') }, function (err) {
        err && console.log(err);
        console.log('follow friday done!');
      });
    });
  },

  fetchList: function (next) {
    this.twit.get(
      'lists/members',
      { slug: this.list_slug, owner_screen_name: this.user },
      function (err, data, res) {
        return next(err, data);
      }
    );
  }

};
