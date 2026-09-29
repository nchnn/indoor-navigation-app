import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Magnetometer, Pedometer } from 'expo-sensors';

type Subscription = { remove: () => void };
import { nodeById } from '../data/old.dorm3F';
import {
  GPS_GOOD_ACC_M,
  calibrationOffsetFor,
  gpsToPlan,
  snapToGraph,
  stepDelta,
  type GpsOffset,
  type PlanPos,
} from '../services/positioning';

export type LiveMode = 'gps' | 'steps';

export interface GpsFix {
  lat: number;
  lng: number;
  acc: number | null;
}

export interface LiveState {
  running: boolean;
  mode: LiveMode;
  gps: GpsFix | null;
  gpsError: string | null;
  gpsWeak: boolean;
  stepsAvailable: boolean | null;
  magAvailable: boolean | null;
  steps: number;
  heading: number | null;
  anchorId: string | null;
  pos: PlanPos | null;
  posSource: 'gps' | 'steps' | null;
  posAccM: number | null;
  snapM: number | null;
  offset: GpsOffset;
}

const compassHeading = (x: number, y: number) =>
  Math.round(((Math.atan2(-x, y) * 180) / Math.PI + 360) % 360);

export function useLiveTracking(initialHeading = 90) {
  const [state, setState] = useState<LiveState>({
    running: false,
    mode: 'steps',
    gps: null,
    gpsError: null,
    gpsWeak: false,
    stepsAvailable: null,
    magAvailable: null,
    steps: 0,
    heading: null,
    anchorId: null,
    pos: null,
    posSource: null,
    posAccM: null,
    snapM: null,
    offset: { dLat: 0, dLng: 0 },
  });

  const locSub = useRef<Location.LocationSubscription | null>(null);
  const stepSub = useRef<Subscription | null>(null);
  const magSub = useRef<Subscription | null>(null);
  const lastSteps = useRef(0);
  const headingRef = useRef<number | null>(null);
  const offsetRef = useRef<GpsOffset>({ dLat: 0, dLng: 0 });
  const anchorRef = useRef<string | null>(null);
  const drPos = useRef<PlanPos | null>(null);
  const modeRef = useRef<LiveMode>('steps');

  const patch = useCallback((p: Partial<LiveState>) => setState((s) => ({ ...s, ...p })), []);

  const clearSubs = useCallback(() => {
    locSub.current?.remove();
    stepSub.current?.remove();
    magSub.current?.remove();
    locSub.current = stepSub.current = magSub.current = null;
  }, []);

  useEffect(() => clearSubs, [clearSubs]);

  const anchorPos = useCallback((id: string | null): PlanPos | null => {
    const n = id ? nodeById(id) : undefined;
    return n ? { x: n.x, y: n.y } : null;
  }, []);

  /** "I'm here" — (re)anchor dead reckoning + calibrate GPS offset to a checkpoint. */
  const iamHere = useCallback(
    (nodeId: string) => {
      anchorRef.current = nodeId;
      const p = anchorPos(nodeId);
      drPos.current = p ? { ...p } : null;
      setState((s) => {
        let offset = s.offset;
        if (s.gps) {
          offset = calibrationOffsetFor(s.gps.lat, s.gps.lng, nodeId);
          offsetRef.current = offset;
        }
        const pos = modeRef.current === 'steps' && p ? { ...p } : s.pos;
        return { ...s, anchorId: nodeId, offset, pos, posSource: pos ? s.posSource : s.posSource };
      });
    },
    [anchorPos],
  );

  const applySteps = useCallback(
    (delta: number) => {
      if (delta <= 0 || !drPos.current) return;
      const h = headingRef.current ?? initialHeading;
      let p = { ...drPos.current };
      for (let i = 0; i < delta; i++) {
        const d = stepDelta(h);
        p = { x: p.x + d.x, y: p.y + d.y };
      }
      const snapped = snapToGraph(p);
      drPos.current = { ...snapped.pos };
      patch({ pos: { ...snapped.pos }, posSource: 'steps', posAccM: 2, snapM: snapped.distM });
    },
    [initialHeading, patch],
  );

  const start = useCallback(
    async (mode: LiveMode, anchorId?: string) => {
      clearSubs();
      modeRef.current = mode;
      lastSteps.current = 0;
      const anchor = anchorId ?? anchorRef.current;
      if (anchor) {
        anchorRef.current = anchor;
        drPos.current = anchorPos(anchor);
      }
      patch({ running: true, mode, gpsError: null, anchorId: anchorRef.current });

      if (mode === 'gps') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          patch({ gpsError: 'Location permission denied — enable it to use GPS.', running: false });
          return;
        }
        locSub.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1, timeInterval: 1000 },
          (loc) => {
            const fix = { lat: loc.coords.latitude, lng: loc.coords.longitude, acc: loc.coords.accuracy ?? null };
            const raw = gpsToPlan(fix.lat, fix.lng, offsetRef.current);
            const snapped = snapToGraph(raw);
            patch({
              gps: fix,
              gpsWeak: (fix.acc ?? 99) > GPS_GOOD_ACC_M,
              pos: { ...snapped.pos },
              posSource: 'gps',
              posAccM: fix.acc,
              snapM: snapped.distM,
            });
          },
        );
      } else {
        const [stepOk, magOk] = await Promise.all([
          Pedometer.isAvailableAsync().catch(() => false),
          Magnetometer.isAvailableAsync().catch(() => false),
        ]);
        patch({ stepsAvailable: stepOk, magAvailable: magOk });
        if (drPos.current) patch({ pos: { ...drPos.current }, posSource: 'steps', posAccM: 2, snapM: 0 });
        if (stepOk) {
          stepSub.current = Pedometer.watchStepCount((res) => {
            const delta = res.steps - lastSteps.current;
            lastSteps.current = res.steps;
            patch({ steps: res.steps });
            applySteps(delta);
          });
        }
        if (magOk) {
          Magnetometer.setUpdateInterval(500);
          magSub.current = Magnetometer.addListener(({ x, y }) => {
            const h = compassHeading(x, y);
            headingRef.current = h;
            patch({ heading: h });
          });
        }
      }
    },
    [anchorPos, applySteps, clearSubs, patch],
  );

  const stop = useCallback(() => {
    clearSubs();
    patch({ running: false, pos: null, posSource: null });
  }, [clearSubs, patch]);

  return { ...state, start, stop, iamHere };
}
