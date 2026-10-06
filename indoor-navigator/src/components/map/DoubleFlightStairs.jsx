import { useId } from 'react';
import {
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text,
} from 'react-native-svg';
import { theme } from '../../theme';

export default function DoubleFlightStairs({
  x = 0,
  y = 0,
  width = 460,
  height = 320,

  // Which side the stair opens to.
  facing = 'right',

  // Which flight is the ascending flight when viewed from the entry.
  upSide = 'left',

  // false = ground floor / no floor below
  // true  = there is a floor below
  hasBelow = false,

  showLabel = true,
}) {
  const wall = theme.colors.roomBorder;
  const wallFill = theme.colors.surface3;
  const stairFill = theme.colors.roomFill;
  const landingFill = theme.colors.surface1;
  const treadLine = theme.colors.hairline;
  const rail = theme.colors.hairlineStrong;
  const ink = theme.colors.inkMuted;

  const horizontal = facing === 'left' || facing === 'right';

  /*
   * Everything is drawn in a single local coordinate system.
   * The entire stair is rotated afterward.
   */
  const lw = horizontal ? width : height;
  const lh = horizontal ? height : width;

  const transforms = {
    right: `translate(${x},${y})`,
    left: `translate(${x + width},${y + height}) rotate(180)`,
    down: `translate(${x + width},${y}) rotate(90)`,
    up: `translate(${x},${y + height}) rotate(-90)`,
  };

  const transform = transforms[facing] || transforms.right;

  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  // =========================================================
  // MAIN GEOMETRY
  // =========================================================

  // Outer wall thickness
  const wallT = Math.max(6, Math.min(lw, lh) * 0.025);

  // Landing width
  const landingW = Math.max(
    70,
    Math.min(lw * 0.25, 300)
  );

  // Stair starts after landing
  const fx0 = wallT + landingW;

  // Stair ends at the open side
  const fx1 = lw - wallT;

  // Actual usable stair width
  const fLen = Math.max(1, fx1 - fx0);

  // Gap between the two flights
  const gap = Math.max(12, lh * 0.045);

  // Total usable vertical space
  const usableH = lh - wallT * 2;

  // Height of each flight
  const fH = Math.max(
    1,
    (usableH - gap) / 2
  );

  const upperY = wallT;
  const lowerY = wallT + fH + gap;

  const upperCY = upperY + fH / 2;
  const lowerCY = lowerY + fH / 2;

  // =========================================================
  // STAIR CONFIGURATION
  // =========================================================

  const isGround = !hasBelow;

  /*
   * Which flight is used as the entry flight and which one
   * continues upward.
   */
  const fromLeft = upSide !== 'right';

  const entryY = fromLeft ? lowerY : upperY;
  const exitY = fromLeft ? upperY : lowerY;

  const entryCY = fromLeft ? lowerCY : upperCY;
  const exitCY = fromLeft ? upperCY : lowerCY;

  // =========================================================
  // TREADS
  // =========================================================

  const steps = 8;

  const treadW = fLen / steps;

  /*
   * Ground floor:
   * The stair continuing upward is cut halfway.
   *
   * Upper floors:
   * Full flight.
   */
  const exitLen = isGround
    ? fLen * 0.52
    : fLen;

  const exitSteps = isGround
    ? Math.max(3, Math.round(steps * 0.52))
    : steps;

  const exitTreadW = exitLen / exitSteps;

  /*
   * Everything related to the ground-floor cut
   * uses this SAME x coordinate.
   */
  const xBreak = fx0 + exitLen;

  /*
   * The exit (continuing) flight is cut on the ground floor;
   * the entry flight always runs the full length.
   */
  const upperCut = fromLeft && isGround;
  const lowerCut = !fromLeft && isGround;

  const upperLen = upperCut ? exitLen : fLen;
  const upperCount = upperCut ? exitSteps : steps;
  const upperTreadW = upperCut ? exitTreadW : treadW;

  const lowerLen = lowerCut ? exitLen : fLen;
  const lowerCount = lowerCut ? exitSteps : steps;
  const lowerTreadW = lowerCut ? exitTreadW : treadW;

  // =========================================================
  // RENDER TREADS
  // =========================================================

  const renderTreads = ({
    y: flightY,
    key,
    length = fLen,
    count = steps,
    treadWidth = treadW,
  }) => {
    return Array.from({ length: count }).map((_, i) => {
      const tx = fx0 + i * treadWidth;

      return (
        <G key={`${key}-${i}`}>
          <Rect
            x={tx}
            y={flightY}
            width={treadWidth}
            height={fH}
            fill={`url(#tread-${uid})`}
            stroke={treadLine}
            strokeWidth={1}
          />

          {/* Strong tread/nosing line */}
          <Line
            x1={tx}
            y1={flightY}
            x2={tx}
            y2={flightY + fH}
            stroke={treadLine}
            strokeWidth={1}
          />
        </G>
      );
    });
  };

  // =========================================================
  // ARROW
  // =========================================================

  const arrowSize = Math.max(
    6,
    Math.min(10, fH * 0.06)
  );

  const arrowInset = Math.max(
    18,
    Math.min(fLen * 0.12, 38)
  );

  /*
   * The arrow is kept INSIDE the actual stair flight.
   */
  const renderArrow = (flightY, direction, length = fLen) => {
    const cy = flightY + fH / 2;

    if (direction === 'right') {
      const startX = fx0 + arrowInset;
      const endX = fx0 + length - arrowInset;

      return (
        <G>
          <Line
            x1={startX}
            y1={cy}
            x2={endX}
            y2={cy}
            stroke={ink}
            strokeWidth={2}
            strokeLinecap="round"
          />

          <Path
            d={`
              M ${endX} ${cy}
              L ${endX - arrowSize} ${cy - arrowSize}
              L ${endX - arrowSize} ${cy + arrowSize}
              Z
            `}
            fill={ink}
          />
        </G>
      );
    }

    const startX = fx0 + length - arrowInset;
    const endX = fx0 + arrowInset;

    return (
      <G>
        <Line
          x1={startX}
          y1={cy}
          x2={endX}
          y2={cy}
          stroke={ink}
          strokeWidth={2}
          strokeLinecap="round"
        />

        <Path
          d={`
            M ${endX} ${cy}
            L ${endX + arrowSize} ${cy - arrowSize}
            L ${endX + arrowSize} ${cy + arrowSize}
            Z
          `}
          fill={ink}
        />
      </G>
    );
  };

  // =========================================================
  // UP ROUTE
  // =========================================================

  /*
   * IMPORTANT:
   * Keep this route INSIDE the actual stairs.
   *
   * Instead of creating the previous large U-shaped path,
   * this uses a short center route through the landing.
   */

  const routeWidth = Math.max(
    1.5,
    Math.min(2, fH * 0.012)
  );

  const landingCX = wallT + landingW / 2;

  const entryRouteStart =
    fx0 + fLen * 0.78;

  const exitRouteEnd = isGround
    ? xBreak - exitTreadW * 0.7
    : fx1 - fLen * 0.08;

  const upPath = `
    M ${entryRouteStart} ${entryCY}
    L ${landingCX} ${entryCY}
    L ${landingCX} ${exitCY}
    L ${exitRouteEnd} ${exitCY}
  `;

  // =========================================================
  // LABEL
  // =========================================================

  const labelX =
    fx0 + (isGround ? exitLen : fLen) * 0.55;

  const labelY =
    entryY + fH * 0.55;

  const labelRotation = {
    right: 0,
    left: 180,
    down: -90,
    up: 90,
  }[facing] ?? 0;

  const labelSize = Math.max(
    10,
    Math.min(14, fH * 0.085)
  );

  // =========================================================
  // HANDRAIL
  // =========================================================

  const railOffset = Math.max(
    5,
    Math.min(fH * 0.14, 18)
  );

  /*
   * Handrail draws on selected edges only.
   * edges: 'both' | 'top' | 'bottom'
   * Outer wall sides keep their rail; the well side is handled
   * by the open-well railings instead (no duplicate lines).
   */
  
  // =========================================================
  // OPEN WELL RAILINGS (hawakan sa gilid ng open space)
  // =========================================================

  // Offset of each railing inside the open well, measured from its flight.
  const wellRailInset = Math.max(
    2,
    Math.min(gap * 0.22, 8)
  );

  const wellTopY = upperY + fH + wellRailInset;
  const wellBottomY = lowerY - wellRailInset;

  // Tick marks give the railing its balusters, like a real stair rail —
  // short posts crossing the handrail at regular intervals, plus a
  // newel post (small square) at each end.
  const balusterHalf = Math.max(
    2.5,
    Math.min(4.5, gap * 0.18)
  );

  const newelSize = Math.max(
    6,
    Math.min(9, gap * 0.4)
  );

  const balusterStep = 26;

  const renderWellRailing = (railY, length, key) => {
    const ticks = [];
    for (
      let tx = fx0 + balusterStep * 0.5;
      tx <= fx0 + length - 4;
      tx += balusterStep
    ) {
      ticks.push(tx);
    }

    return (
      <G key={key}>
        {/* handrail */}
        <Line
          x1={fx0}
          y1={railY}
          x2={fx0 + length}
          y2={railY}
          stroke={rail}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* balusters */}
        {ticks.map((tx) => (
          <Line
            key={`${key}-b-${tx}`}
            x1={tx}
            y1={railY - balusterHalf}
            x2={tx}
            y2={railY + balusterHalf}
            stroke={rail}
            strokeWidth={1}
          />
        ))}

        {/* newel posts at both ends */}
        <Rect
          x={fx0 + 2 - newelSize / 2}
          y={railY - newelSize / 2}
          width={newelSize}
          height={newelSize}
          fill={wallFill}
          stroke={wall}
          strokeWidth={1}
        />
        <Rect
          x={fx0 + length - 2 - newelSize / 2}
          y={railY - newelSize / 2}
          width={newelSize}
          height={newelSize}
          fill={wallFill}
          stroke={wall}
          strokeWidth={1}
        />
      </G>
    );
  };

  // =========================================================
  // GROUND FLOOR BREAK
  // =========================================================

  const breakSize = Math.max(
    10,
    Math.min(18, exitTreadW * 1.2)
  );

  const breakPath = `
    M ${xBreak} ${exitY}
    L ${xBreak - breakSize} ${exitY + fH}
  `;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <G transform={transform}>

      {/* =====================================================
          DEFINITIONS
      ===================================================== */}

      <Defs>

        {/* Stair tread */}
        <LinearGradient
          id={`tread-${uid}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <Stop
            offset="0"
            stopColor={theme.colors.roomFill}
          />

          <Stop
            offset="1"
            stopColor={theme.colors.surface1}
          />
        </LinearGradient>

        {/* Wall */}
        <LinearGradient
          id={`wall-${uid}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <Stop
            offset="0"
            stopColor={theme.colors.surface4}
          />

          <Stop
            offset="1"
            stopColor={theme.colors.surface2}
          />
        </LinearGradient>

        {/* Landing */}
        <LinearGradient
          id={`landing-${uid}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <Stop
            offset="0"
            stopColor={theme.colors.surface1}
          />

          <Stop
            offset="1"
            stopColor={theme.colors.surface2}
          />
        </LinearGradient>

      </Defs>

      {/* =====================================================
          OUTER FLOORPLAN BODY
      ===================================================== */}

      <Rect
        x={0}
        y={0}
        width={lw}
        height={lh}
        fill={theme.colors.roomFill}
      />

      {/* =====================================================
          OUTER WALLS
      ===================================================== */}

      {/* Left */}
      <Rect
        x={0}
        y={0}
        width={wallT}
        height={lh}
        fill={`url(#wall-${uid})`}
        stroke={wall}
        strokeWidth={1.5}
      />

      {/* Top */}
      <Rect
        x={0}
        y={0}
        width={lw}
        height={wallT}
        fill={`url(#wall-${uid})`}
        stroke={wall}
        strokeWidth={1.5}
      />

      {/* Bottom */}
      <Rect
        x={0}
        y={lh - wallT}
        width={lw}
        height={wallT}
        fill={`url(#wall-${uid})`}
        stroke={wall}
        strokeWidth={1.5}
      />

      {/* =====================================================
          LANDING
      ===================================================== */}

      <Rect
        x={wallT}
        y={wallT}
        width={landingW}
        height={usableH}
        fill={`url(#landing-${uid})`}
        stroke="none"
      />

      {/* Landing center detail — removed: it drew a stray line across the landing */}

      {/* =====================================================
          OPEN WELL (no fill, no border — genuinely open space)
      ===================================================== */}

      {/* NOTE: the well strip is intentionally left empty so the
          floor base shows through. Railings run along both sides. */}

      {/* =====================================================
          UPPER FLIGHT
      ===================================================== */}

      {renderTreads({
        y: upperY,
        key: 'upper',
        length: upperLen,
        count: upperCount,
        treadWidth: upperTreadW,
      })}

      {/* =====================================================
          LOWER FLIGHT
      ===================================================== */}

      {renderTreads({
        y: lowerY,
        key: 'lower',
        length: lowerLen,
        count: lowerCount,
        treadWidth: lowerTreadW,
      })}

      {/* =====================================================
          FLIGHT OUTER EDGES
      ===================================================== */}

      {/* Upper top edge */}
      <Line
        x1={fx0}
        y1={upperY}
        x2={fx0 + upperLen}
        y2={upperY}
        stroke={wall}
        strokeWidth={2}
      />

      {/* Upper bottom edge */}
      <Line
        x1={fx0}
        y1={upperY + fH}
        x2={fx0 + upperLen}
        y2={upperY + fH}
        stroke={wall}
        strokeWidth={2}
      />

      {/* Lower top edge */}
      <Line
        x1={fx0}
        y1={lowerY}
        x2={fx0 + lowerLen}
        y2={lowerY}
        stroke={wall}
        strokeWidth={2}
      />

      {/* Lower bottom edge */}
      <Line
        x1={fx0}
        y1={lowerY + fH}
        x2={fx0 + lowerLen}
        y2={lowerY + fH}
        stroke={wall}
        strokeWidth={2}
      />

      {/* =====================================================
          LANDING / FLIGHT JOINT
      ===================================================== */}

      <Line
        x1={fx0}
        y1={upperY}
        x2={fx0}
        y2={upperY + fH}
        stroke={wall}
        strokeWidth={2}
      />

      <Line
        x1={fx0}
        y1={lowerY}
        x2={fx0}
        y2={lowerY + fH}
        stroke={wall}
        strokeWidth={2}
      />

      {/* =====================================================
          OPEN-WELL RAILINGS
          Hawakan sa magkabilang gilid ng open space, na may
          balusters at newel posts tulad ng tunay na hagdan.
      ===================================================== */}

      {renderWellRailing(
        wellTopY,
        upperLen,
        'well-top'
      )}

      {renderWellRailing(
        wellBottomY,
        lowerLen,
        'well-bottom'
      )}

      {/* Cross piece at the landing end — joins both well rails so the
          handrail wraps continuously around the opening (U-turn), while
          the entry end stays open with its newel posts. */}
      <Line
        x1={fx0}
        y1={wellTopY}
        x2={fx0}
        y2={wellBottomY}
        stroke={rail}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* =====================================================
          HANDRAILS (outer wall sides only — well side already
          covered by the open-well railings above)
      ===================================================== */}

      

      {/* =====================================================
          GROUND FLOOR CUT
      ===================================================== */}

      {isGround && (
        <Path
          d={breakPath}
          fill="none"
          stroke={wall}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* =====================================================
          UP ROUTE
      ===================================================== */}

      

      {/* =====================================================
          UP LABEL
      ===================================================== */}

      

      {/* =====================================================
          ENTRY EDGE
      ===================================================== */}

      <Line
        x1={fx1}
        y1={entryY}
        x2={fx1}
        y2={entryY + fH}
        stroke={wall}
        strokeWidth={2}
      />

      {/* Full upper/lower exit edge only when not ground */}
      {!isGround && (
        <Line
          x1={fx1}
          y1={exitY}
          x2={fx1}
          y2={exitY + fH}
          stroke={wall}
          strokeWidth={2}
        />
      )}

    </G>
  );
}