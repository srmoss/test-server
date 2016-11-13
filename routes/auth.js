var express = require('express');
var fork = require('child_process').fork;
var cron = require('cron');
var router = express.Router();

/* POST auth. */
router.post('/', function(req, res, next) {
  if (req.body.key == process.env.AUTH_KEY)
  {
    //Authenticated
    if (req.body.action == 'Authenticate')
    {
      //this.childMonitor = fork('../cgm-remote-monitor/server.js', [], {execArgv: []});
      this.job = cron.job('0 */5 * * * *', function populate () {
        var childPopulate = fork('../cgm-remote-monitor/testing/populate_rest.remote.js', [], {execArgv: []});
      });
      this.job.start();
      res.render('success', { message: 'Success' });
    }
    else if (req.body.action == 'End')
    {
      this.childMonitor.kill();
      this.job.stop();
      res.render('success', { message: 'Success' });
    }
  }
  else
  {
    res.locals.message = 'Unauthorized'
    res.locals.error = req.app.get('env') === 'development' ? {"status":"500", "stack":"auth.js"} : {};
    res.status(500);
    res.render('error');
  }
});

module.exports = router;