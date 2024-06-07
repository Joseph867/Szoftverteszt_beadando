const { describe, it, expect } = require('vitest');
const { JaratKezelo, NegativKesesException } = require('../JaratKezelo');

describe('JaratKezelo', () => {
  let jaratKezelo;

  beforeEach(() => {
    jaratKezelo = new JaratKezelo();
  });

  it('should add a new flight', () => {
    jaratKezelo.ujJarat('AA123', 'BUD', 'JFK', '2023-01-01T10:00:00Z');
    expect(jaratKezelo.jaratok.size).toBe(1);
  });

  it('should not allow duplicate flight numbers', () => {
    jaratKezelo.ujJarat('AA123', 'BUD', 'JFK', '2023-01-01T10:00:00Z');
    expect(() => {
      jaratKezelo.ujJarat('AA123', 'BUD', 'LAX', '2023-01-01T12:00:00Z');
    }).toThrow('Járatszám már létezik.');
  });

  it('should add delay to flight', () => {
    jaratKezelo.ujJarat('AA123', 'BUD', 'JFK', '2023-01-01T10:00:00Z');
    jaratKezelo.keses('AA123', 30);
    expect(jaratKezelo.jaratok.get('AA123').keses).toBe(30);
  });

  it('should not allow negative total delay', () => {
    jaratKezelo.ujJarat('AA123', 'BUD', 'JFK', '2023-01-01T10:00:00Z');
    expect(() => {
      jaratKezelo.keses('AA123', -30);
    }).toThrow(NegativKesesException);
  });

  it('should calculate the correct departure time', () => {
    jaratKezelo.ujJarat('AA123', 'BUD', 'JFK', '2023-01-01T10:00:00Z');
    jaratKezelo.keses('AA123', 30);
    const actualDeparture = jaratKezelo.mikorIndul('AA123');
    expect(actualDeparture.toISOString()).toBe('2023-01-01T10:30:00.000Z');
  });

  it('should list flights from a specific airport', () => {
    jaratKezelo.ujJarat('AA123', 'BUD', 'JFK', '2023-01-01T10:00:00Z');
    jaratKezelo.ujJarat('AA124', 'BUD', 'LAX', '2023-01-01T12:00:00Z');
    jaratKezelo.ujJarat('BA123', 'LHR', 'JFK', '2023-01-01T14:00:00Z');
    const flightsFromBUD = jaratKezelo.jaratokRepuloterrol('BUD');
    expect(flightsFromBUD).toEqual(['AA123', 'AA124']);
  });
});