var express = require('express'),
    router = express.Router(),
    request = require('request'),
    YouTube = require('../models/youtube');

var YOUTUBE_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth',
    YOUTUBE_AUTH_REDIRECT_URL = 'http://localhost:4000/api/youtube/auth';

router.get('/', function(req, res) {
    YouTube.monthActivity(0, function(error, data) {
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

    YouTube.setup(function(error, data) {
        res.status(200).send(error ? 'Setup failed see logs' : 'Setup done!');
    });
});

router.get('/auth', function(req, res) {
    if (process.env.YOUTUBE_OAUTH_ENABLED != 'true') {
        res.status(404).send('Not found');
        return;
    }

    var code = req.query.code;
    if (code) {
        YouTube.getToken(code, function(response) {
            res.status(200).json(response);
        });
    } else {
        var url =
            YOUTUBE_AUTH_URL +
            '?client_id=' +
            process.env.YOUTUBE_CLIENT_ID +
            '&redirect_uri=' +
            YOUTUBE_AUTH_REDIRECT_URL +
            '&scope=https://www.googleapis.com/auth/youtube&response_type=code&access_type=offline&approval_prompt=force';
        res.redirect(url);
    }
});

router.get('/user', function(req, res) {
    YouTube.user(function(error, data) {
        res.status(200).json(data);
    });
});

router.get('/likes', function(req, res) {
    YouTube.likes(function(error, data) {
        res.status(200).json(data);
    });
});

router.get('/:page', function(req, res) {
    var page = parseInt(req.params.page);
    if (!page) page = 0;

    YouTube.recentActivity(page, function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

module.exports = router;
