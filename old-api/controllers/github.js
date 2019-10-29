var express = require('express'),
    router = express.Router(),
    Github = require('../models/github');

var GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize',
    GITHUB_AUTH_REDIRECT_URL = 'http://localhost:4000/api/github/auth';

router.get('/', function(req, res) {
    Github.monthActivity(0, function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

router.get('/setup', function(req, res) {
    if (process.env.SETUP_ENABLED != 'true') {
        res.status(404).send('Not found');
        return;
    }

    Github.setup(function(error, data) {
        res.status(200).send(error ? 'Setup failed see logs' : 'Setup done!');
    });
});

router.get('/auth', function(req, res) {
    if (process.env.GITHUB_OAUTH_ENABLED != 'true') {
        res.status(404).send('Not found');
        return;
    }

    var code = req.query.code;
    if (code) {
        Github.getToken(code, function(response) {
            res.status(200).json(response);
        });
    } else {
        var url =
            GITHUB_AUTH_URL + '?client_id=' + process.env.GITHUB_CLIENT_ID + '&redirect_uri=' + GITHUB_AUTH_REDIRECT_URL + '&response_type=code';
        res.redirect(url);
    }
});

router.get('/user', function(req, res) {
    Github.user(function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

router.get('/repos', function(req, res) {
    Github.repos(function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

router.get('/activity', function(req, res) {
    Github.recentActivity(function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

module.exports = router;
