import { calcDays } from './app';

test('App has function defined to calculate days', () => {
    expect(calcDays).toBeDefined();
})

test('App correctly calculates days', () => {
    expect(calcDays(new Date())).toBe(0);
})
