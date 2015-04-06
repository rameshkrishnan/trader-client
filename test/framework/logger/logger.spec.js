/* jshint -W117 */
describe('logger', function() {
    'use strict';

    var logger,
        $log,
        parameters = {
            message: 'my log message',
            data: 'my data'
        };

    beforeEach(module('fw.logger'));

    beforeEach(function() {
        $log = {
            log: jasmine.createSpy(),
            info: jasmine.createSpy(),
            warn: jasmine.createSpy(),
            error: jasmine.createSpy(),
            debug: jasmine.createSpy()
        };
        module(function($provide) {
            $provide.value('$log', $log);
        });
    });

    beforeEach(
        inject(function(_logger_, _$log_) {
            logger = _logger_;
            $log = _$log_;
        })
    );

    it('should be defined', function() {
        expect(logger).toBeDefined();
    });

    it('should have log method', function() {
        logger.log(parameters.message, parameters.data);
        expect($log.log).toHaveBeenCalledWith('log: ' + parameters.message, parameters.data);
    });

    it('should have info method', function() {
        logger.info(parameters.message, parameters.data);
        expect($log.info).toHaveBeenCalledWith('info: ' + parameters.message, parameters.data);
    });

    it('should have warn method', function() {
        logger.warn(parameters.message, parameters.data);
        expect($log.warn).toHaveBeenCalledWith('warn: ' + parameters.message, parameters.data);
    });

    it('should have error method', function() {
        logger.error(parameters.message, parameters.data);
        expect($log.error).toHaveBeenCalledWith('error: ' + parameters.message, parameters.data);
    });

    it('should have debug method', function() {
        logger.debug(parameters.message, parameters.data);
        expect($log.debug).toHaveBeenCalledWith('debug: ' + parameters.message, parameters.data);
    });
});