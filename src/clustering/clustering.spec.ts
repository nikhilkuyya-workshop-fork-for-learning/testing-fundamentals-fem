import { describe, it, expect } from 'vitest';
import { cluster, Location } from './clustering';

describe('clustering', () => {

    it('should return no cluster if empty dataset', () => {
        const dataset: Location[] = [];
        const result = cluster(dataset);
        expect(result.clusters).toEqual([]);
    });

    it("should create two clusters if two points are separated by more than the neighborhood radius", () => {
        const dataset: Location[] = [
            { lat: 0, lng: 0 },
            { lat: 1, lng: 1 },
            { lat: 10, lng: 10 },
            { lat: 11, lng: 11 },
        ];
        const result = cluster(dataset, 5, 1);
        expect(result).toMatchObject({
            clusters: [{ data: [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }] }, { data: [{ lat: 10, lng: 10 }, { lat: 11, lng: 11 }] }],
            latMin: 0, latMax: 11, lngMin: 0, lngMax: 11
        });
    });

    it("should create only one with minClusterSize threshold", () => {
        const dataset: Location[] = [
            { lat: 0, lng: 0 },
            { lat: 1, lng: 1 },
            { lat: 2, lng: 2 },
            { lat: -1, lng: -1 },
            { lat: -2, lng: -2 },
            { lat: 10, lng: 10 },
            { lat: 11, lng: 11 },
        ];
        const result = cluster(dataset, 5, 3);
        expect(result).toMatchObject({
            clusters: [{ data: [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }, { lat: 2, lng: 2 }, { lat: -1, lng: -1 }, { lat: -2, lng: -2 }] }],
            latMin: -2, latMax: 2, lngMin: -2, lngMax: 2
        });
    })

});