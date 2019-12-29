import {darkSkyUrl} from './darkSkyApi.js';
import "regenerator-runtime/runtime";

test('Dark Sky API URL is defined', () => {
    expect(darkSkyUrl).toBeDefined();
})
