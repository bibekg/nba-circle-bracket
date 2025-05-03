// --- Data ---
// Placeholder function to get mock data. Replace this with API call later.
function getMockPlayoffData() {
  // Mock data representing a simplified 2023 playoffs structure
  // We'll need a more detailed structure for actual rendering
  return {
    year: 2023,
    rounds: [
      {
        name: "First Round",
        series: [
          // East
          {
            id: "E1",
            conference: "East",
            round: 1,
            highSeed: { name: "MIL", seed: 1, winner: false, gamesWon: 1 },
            lowSeed: { name: "MIA", seed: 8, winner: true, gamesWon: 4 },
          }, // Flipped winner for example
          {
            id: "E2",
            conference: "East",
            round: 1,
            highSeed: { name: "CLE", seed: 4, winner: false, gamesWon: 1 },
            lowSeed: { name: "NYK", seed: 5, winner: true, gamesWon: 4 },
          },
          {
            id: "E3",
            conference: "East",
            round: 1,
            highSeed: { name: "PHI", seed: 3, winner: true, gamesWon: 4 },
            lowSeed: { name: "BKN", seed: 6, winner: false, gamesWon: 0 },
          },
          {
            id: "E4",
            conference: "East",
            round: 1,
            highSeed: { name: "BOS", seed: 2, winner: true, gamesWon: 4 },
            lowSeed: { name: "ATL", seed: 7, winner: false, gamesWon: 2 },
          },
          // West
          {
            id: "W1",
            conference: "West",
            round: 1,
            highSeed: { name: "DEN", seed: 1, winner: true, gamesWon: 4 },
            lowSeed: { name: "MIN", seed: 8, winner: false, gamesWon: 1 },
          },
          {
            id: "W2",
            conference: "West",
            round: 1,
            highSeed: { name: "PHX", seed: 4, winner: true, gamesWon: 4 },
            lowSeed: { name: "LAC", seed: 5, winner: false, gamesWon: 1 },
          },
          {
            id: "W3",
            conference: "West",
            round: 1,
            highSeed: { name: "SAC", seed: 3, winner: false, gamesWon: 3 },
            lowSeed: { name: "GSW", seed: 6, winner: true, gamesWon: 4 },
          },
          {
            id: "W4",
            conference: "West",
            round: 1,
            highSeed: { name: "MEM", seed: 2, winner: false, gamesWon: 2 },
            lowSeed: { name: "LAL", seed: 7, winner: true, gamesWon: 4 },
          },
        ],
      },
      {
        name: "Conference Semifinals",
        series: [
          // East
          {
            id: "E5",
            conference: "East",
            round: 2,
            sourceSeriesIds: ["E1", "E2"],
            highSeed: { name: "MIA", seed: 8, winner: true, gamesWon: 4 },
            lowSeed: { name: "NYK", seed: 5, winner: false, gamesWon: 2 },
          },
          {
            id: "E6",
            conference: "East",
            round: 2,
            sourceSeriesIds: ["E3", "E4"],
            highSeed: { name: "BOS", seed: 2, winner: true, gamesWon: 4 },
            lowSeed: { name: "PHI", seed: 3, winner: false, gamesWon: 3 },
          },
          // West
          {
            id: "W5",
            conference: "West",
            round: 2,
            sourceSeriesIds: ["W1", "W2"],
            highSeed: { name: "DEN", seed: 1, winner: true, gamesWon: 4 },
            lowSeed: { name: "PHX", seed: 4, winner: false, gamesWon: 2 },
          },
          {
            id: "W6",
            conference: "West",
            round: 2,
            sourceSeriesIds: ["W3", "W4"],
            highSeed: { name: "LAL", seed: 7, winner: true, gamesWon: 4 },
            lowSeed: { name: "GSW", seed: 6, winner: false, gamesWon: 2 },
          },
        ],
      },
      {
        name: "Conference Finals",
        series: [
          {
            id: "E7",
            conference: "East",
            round: 3,
            sourceSeriesIds: ["E5", "E6"],
            highSeed: { name: "BOS", seed: 2, winner: false, gamesWon: 3 },
            lowSeed: { name: "MIA", seed: 8, winner: true, gamesWon: 4 },
          },
          {
            id: "W7",
            conference: "West",
            round: 3,
            sourceSeriesIds: ["W5", "W6"],
            highSeed: { name: "DEN", seed: 1, winner: true, gamesWon: 4 },
            lowSeed: { name: "LAL", seed: 7, winner: false, gamesWon: 0 },
          },
        ],
      },
      {
        name: "NBA Finals",
        series: [
          {
            id: "F1",
            conference: "Finals",
            round: 4,
            sourceSeriesIds: ["E7", "W7"],
            highSeed: { name: "DEN", seed: 1, winner: true, gamesWon: 4 },
            lowSeed: { name: "MIA", seed: 8, winner: false, gamesWon: 1 },
          },
        ],
      },
    ],
  };
}

// --- D3 Rendering ---
function renderBracket(data) {
  const container = d3.select("#bracket-container");
  container.selectAll("*").remove(); // Clear previous rendering

  const width = parseInt(container.style("width"));
  const height = parseInt(container.style("height"));
  const margin = { top: 60, right: 60, bottom: 60, left: 60 }; // Increased margin
  const effectiveWidth = width - margin.left - margin.right;
  const effectiveHeight = height - margin.top - margin.bottom;
  const outerRadius = Math.min(effectiveWidth, effectiveHeight) / 2;
  const innerRadius = 40; // Radius for the center/trophy area
  const numRounds = data.rounds.length;
  const roundDepth = (outerRadius - innerRadius) / numRounds;
  const teamArcPadding = 0.02; // radians, for small gap between team arcs

  // Map team names to colors (simplified)
  const teamColors = {
    // East
    MIL: "#00471B",
    MIA: "#98002E",
    CLE: "#6F263D",
    NYK: "#006BB6",
    PHI: "#ED174C",
    BKN: "#000000",
    BOS: "#008348",
    ATL: "#E03A3E",
    // West
    DEN: "#0E2240",
    MIN: "#0C2340",
    PHX: "#1D1160",
    LAC: "#C8102E",
    SAC: "#5A2D81",
    GSW: "#006BB6",
    MEM: "#5D76A9",
    LAL: "#552583",
    TBD: "#888888",
  };
  const defaultColor = "#AAAAAA";

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  console.log("Rendering bracket v3 with data:", data);
  console.log(
    `SVG: width=${width}, height=${height}, outerRadius=${outerRadius}, innerRadius=${innerRadius}, roundDepth=${roundDepth}`,
  );

  // --- Scales ---
  // Radial scale for rounds (Reversed: 0=outer, numRounds=inner)
  const radialScale = d3.scaleLinear().domain([0, numRounds]).range([outerRadius, innerRadius]); // REVERSED Range

  // Angular scale for the first round (16 teams)
  const firstRoundSeries = data.rounds[0].series;
  const numFirstRoundSeries = firstRoundSeries.length; // Should be 8
  const teamsPerSeries = 2;
  const numFirstRoundSlots = numFirstRoundSeries * teamsPerSeries; // 16 slots

  const angularScale = d3
    .scaleLinear()
    .domain([0, numFirstRoundSlots])
    .range([0, 2 * Math.PI]); // Full circle

  // --- Helper Functions ---
  // Function to get the radius for the middle of a round band
  function getMidRadius(roundIndex) {
    // roundIndex is 0-based (0 for first round)
    return radialScale(roundIndex + 0.5);
  }

  // Calculate position at the center of a team's arc in Round 1
  function getRound1TeamCenterPosition(team, series, seriesIndex) {
    const roundIndex = 0;
    const numSeriesInRound = data.rounds[roundIndex].series.length;
    const slotsPerSeries = numFirstRoundSlots / numSeriesInRound;
    const seriesStartSlot = seriesIndex * slotsPerSeries;

    const teamCenterSlotOffset =
      team === series.highSeed ? slotsPerSeries / 4 : (slotsPerSeries * 3) / 4;
    const teamCenterSlot = seriesStartSlot + teamCenterSlotOffset;

    const angle = angularScale(teamCenterSlot);
    const radius = getMidRadius(roundIndex);

    return {
      x: radius * Math.cos(angle - Math.PI / 2),
      y: radius * Math.sin(angle - Math.PI / 2),
      angle: angle, // Angle in radians from positive x-axis (0 = 3 o'clock)
      radius: radius,
    };
  }

  function getSeriesMidPoint(series, roundNum) {
    const roundIndex = roundNum - 1;
    const seriesIndex = data.rounds[roundIndex].series.findIndex((s) => s.id === series.id);
    const numSeriesInRound = data.rounds[roundIndex].series.length;
    const slotsPerSeries = numFirstRoundSlots / numSeriesInRound;

    const seriesMidSlot = seriesIndex * slotsPerSeries + slotsPerSeries / 2;
    const angle = angularScale(seriesMidSlot);
    const radius = getMidRadius(roundIndex);

    return {
      x: radius * Math.cos(angle - Math.PI / 2),
      y: radius * Math.sin(angle - Math.PI / 2),
      angle: angle,
      radius: radius,
    };
  }

  // Store positions for connectors
  const teamPositions = {};
  const seriesMidpoints = {};

  // --- Helper Function to Draw Dots ---
  function drawGameDots(container, teamData, centerPos, roundIndex) {
    const gamesWon = teamData.gamesWon || 0;
    const totalDots = 4; // Always show 4 potential win dots

    const dotRadius = 2.5;
    const dotArcRadius = radialScale(roundIndex + 1) + roundDepth * 0.2;
    const desiredArcSeparation = dotRadius * 2 * 1.2;
    const angularSeparation = desiredArcSeparation / dotArcRadius;

    const centerAngle = centerPos.angle;

    // Calculate angles based on totalDots (4)
    const totalAngularSpan = (totalDots - 1) * angularSeparation;
    const startAngle = centerAngle - totalAngularSpan / 2;

    for (let i = 0; i < totalDots; i++) {
      const dotAngle = startAngle + i * angularSeparation;

      const dotX = dotArcRadius * Math.cos(dotAngle - Math.PI / 2);
      const dotY = dotArcRadius * Math.sin(dotAngle - Math.PI / 2);

      // Determine fill opacity based on actual games won
      const fillOpacity = i < gamesWon ? 1 : 0.5; // 1 for win, 0.5 for loss/potential

      container
        .append("circle")
        .attr("cx", dotX)
        .attr("cy", dotY)
        .attr("r", dotRadius)
        .attr("fill", "white") // Always fill white
        .attr("fill-opacity", fillOpacity) // Set opacity
        .attr("stroke", "rgba(0,0,0,0.3)")
        .attr("stroke-width", 0.5);
    }
  }

  // --- Draw Round Arcs ---
  const roundArcGenerator = d3
    .arc()
    .startAngle(0)
    .endAngle(2 * Math.PI);

  svg
    .selectAll(".round-arc")
    .data(data.rounds)
    .enter()
    .append("path")
    .attr("class", "round-arc")
    .attr("d", (d, i) =>
      roundArcGenerator({
        // Use radialScale correctly for reversed range
        innerRadius: radialScale(i + 1),
        outerRadius: radialScale(i),
      }),
    )
    .attr("fill", (d, i) => (i % 2 === 0 ? "#ffffff" : "#f0f0f0")) // Adjusted colors slightly
    .attr("stroke", "#ccc");

  // --- Draw Series and Teams (Round 1) ---
  const round1Data = data.rounds[0];
  const round1Index = 0;
  teamPositions[1] = {};
  seriesMidpoints[1] = {};

  round1Data.series.forEach((series, seriesIndex) => {
    const numSeriesInRound = round1Data.series.length;
    const slotsPerSeries = numFirstRoundSlots / numSeriesInRound;
    const seriesStartSlot = seriesIndex * slotsPerSeries;
    const seriesEndSlot = (seriesIndex + 1) * slotsPerSeries;

    const seriesArcGenerator = d3
      .arc()
      .innerRadius(radialScale(round1Index + 1)) // Inner edge of round 1 band
      .outerRadius(radialScale(round1Index)); // Outer edge of round 1 band

    seriesMidpoints[1][series.id] = getSeriesMidPoint(series, 1);
    teamPositions[1][series.id] = {};

    // Draw High Seed Arc + Label
    const highSeedAngleStart = angularScale(seriesStartSlot) + teamArcPadding / 2;
    const highSeedAngleEnd =
      angularScale(seriesStartSlot + slotsPerSeries / 2) - teamArcPadding / 2;
    const highSeedArc = seriesArcGenerator({
      startAngle: highSeedAngleStart,
      endAngle: highSeedAngleEnd,
    });
    // Store the center position calculated specifically for the team
    const highSeedPosition = getRound1TeamCenterPosition(series.highSeed, series, seriesIndex);
    teamPositions[1][series.id][series.highSeed.name] = {
      ...highSeedPosition,
      winner: series.highSeed.winner,
    };

    svg
      .append("path")
      .attr("d", highSeedArc)
      .attr("fill", teamColors[series.highSeed.name] || defaultColor)
      .attr("stroke", "#fff");

    // Draw High Seed Dots
    drawGameDots(svg, series.highSeed, highSeedPosition, round1Index);

    // Label Placement for Round 1
    const labelRadius = getMidRadius(round1Index);
    const labelAngle = highSeedPosition.angle; // Use the calculated center angle
    const labelX = labelRadius * Math.cos(labelAngle - Math.PI / 2);
    const labelY = labelRadius * Math.sin(labelAngle - Math.PI / 2);
    // Adjust rotation: 0 if top/bottom half, slight angle otherwise, avoid upside down
    let rotation = (labelAngle * 180) / Math.PI - 90; // Angle relative to vertical
    if (rotation > 90 || rotation < -90) {
      // Correct rotation for left hemisphere
      rotation += 180;
    }

    svg
      .append("text")
      .attr("class", "team-label")
      .attr("transform", `translate(${labelX}, ${labelY}) rotate(${rotation})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "white")
      .style("font-size", "10px")
      .style("font-weight", series.highSeed.winner ? "bold" : "normal")
      .text(series.highSeed.name);

    // Draw Low Seed Arc + Label
    const lowSeedAngleStart =
      angularScale(seriesStartSlot + slotsPerSeries / 2) + teamArcPadding / 2;
    const lowSeedAngleEnd = angularScale(seriesEndSlot) - teamArcPadding / 2;
    const lowSeedArc = seriesArcGenerator({
      startAngle: lowSeedAngleStart,
      endAngle: lowSeedAngleEnd,
    });
    const lowSeedPosition = getRound1TeamCenterPosition(series.lowSeed, series, seriesIndex);
    teamPositions[1][series.id][series.lowSeed.name] = {
      ...lowSeedPosition,
      winner: series.lowSeed.winner,
    };

    svg
      .append("path")
      .attr("d", lowSeedArc)
      .attr("fill", teamColors[series.lowSeed.name] || defaultColor)
      .attr("stroke", "#fff");

    // Draw Low Seed Dots
    drawGameDots(svg, series.lowSeed, lowSeedPosition, round1Index);

    const lowSeedLabelAngle = lowSeedPosition.angle;
    const lowSeedLabelX = labelRadius * Math.cos(lowSeedLabelAngle - Math.PI / 2);
    const lowSeedLabelY = labelRadius * Math.sin(lowSeedLabelAngle - Math.PI / 2);
    let lowSeedRotation = (lowSeedLabelAngle * 180) / Math.PI - 90;
    if (lowSeedRotation > 90 || lowSeedRotation < -90) {
      lowSeedRotation += 180;
    }

    svg
      .append("text")
      .attr("class", "team-label")
      .attr("transform", `translate(${lowSeedLabelX}, ${lowSeedLabelY}) rotate(${lowSeedRotation})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "white")
      .style("font-size", "10px")
      .style("font-weight", series.lowSeed.winner ? "bold" : "normal")
      .text(series.lowSeed.name);
  });

  // --- Draw Subsequent Rounds, Connectors, and Winner Markers ---
  for (let roundNum = 2; roundNum <= numRounds; roundNum++) {
    const roundIndex = roundNum - 1;
    const currentRoundData = data.rounds[roundIndex];
    const prevRoundIndex = roundIndex - 1; // Index for the previous round data
    const prevRoundData = data.rounds[prevRoundIndex];
    teamPositions[roundNum] = {}; // Store positions for potential connectors
    seriesMidpoints[roundNum] = {}; // Store midpoints for potential connectors

    const numSeriesInCurrentRound = currentRoundData.series.length;
    // Note: slotsPerSeriesCurrent is NOT directly used for arc angles anymore
    // const slotsPerSeriesCurrent = numFirstRoundSlots / numSeriesInCurrentRound;

    // Arc generator for the current round's band thickness
    const roundArcGenerator = d3
      .arc()
      .innerRadius(radialScale(roundIndex + 1))
      .outerRadius(radialScale(roundIndex));

    // Pre-calculate previous round winners and their angular slot ranges
    // This is crucial for knowing where to draw the arcs in the current round band
    const prevRoundInfo = {};
    const numSeriesInPrevRound = prevRoundData.series.length;
    const slotsPerSeriesPrev = numFirstRoundSlots / numSeriesInPrevRound;
    prevRoundData.series.forEach((prevSeries, prevSeriesIndex) => {
      const prevWinner = prevSeries.highSeed.winner ? prevSeries.highSeed : prevSeries.lowSeed;
      const startSlot = prevSeriesIndex * slotsPerSeriesPrev;
      const endSlot = (prevSeriesIndex + 1) * slotsPerSeriesPrev;
      prevRoundInfo[prevSeries.id] = {
        winner: prevWinner,
        startAngle: angularScale(startSlot), // Base angle on the fixed 16-slot scale
        endAngle: angularScale(endSlot),
      };
    });

    currentRoundData.series.forEach((series /*, seriesIndex*/) => {
      const seriesWinner = series.highSeed.winner ? series.highSeed : series.lowSeed;
      // const seriesLoser = series.highSeed.winner ? series.lowSeed : series.highSeed; // Not directly used below

      // Get info for the two teams competing in this series (winners from previous round)
      const sourceIdA = series.sourceSeriesIds[0];
      const sourceIdB = series.sourceSeriesIds[1];
      const infoA = prevRoundInfo[sourceIdA];
      const infoB = prevRoundInfo[sourceIdB];

      if (!infoA || !infoB) {
        console.error("Could not find previous round info for series", series.id);
        return; // Skip rendering this part if data is inconsistent
      }

      const winnerA = infoA.winner; // Team advancing from source series A
      const winnerB = infoB.winner; // Team advancing from source series B

      // Use a smaller padding proportional to the arc size
      // Calculate padding based on the angular span of one previous series slot
      const basePaddingAngle = (infoA.endAngle - infoA.startAngle) * 0.03; // Small % of arc width
      const padding = Math.min(teamArcPadding / numSeriesInPrevRound, basePaddingAngle); // Ensure reasonable padding

      // --- Draw Arc for Winner A ---
      // Use the angular range determined by source series A's position in the previous round
      const arcA_start = infoA.startAngle + padding / 2;
      const arcA_end = infoA.endAngle - padding / 2;
      // Ensure start < end, handle potential floating point issues
      if (arcA_start < arcA_end) {
        svg
          .append("path")
          .attr("d", roundArcGenerator({ startAngle: arcA_start, endAngle: arcA_end }))
          .attr("fill", teamColors[winnerA.name] || defaultColor)
          .attr("stroke", "#fff");
      }

      // --- Draw Arc for Winner B ---
      // Use the angular range determined by source series B's position in the previous round
      const arcB_start = infoB.startAngle + padding / 2;
      const arcB_end = infoB.endAngle - padding / 2;
      // Ensure start < end
      if (arcB_start < arcB_end) {
        svg
          .append("path")
          .attr("d", roundArcGenerator({ startAngle: arcB_start, endAngle: arcB_end }))
          .attr("fill", teamColors[winnerB.name] || defaultColor)
          .attr("stroke", "#fff");
      }

      // --- Position and Draw Labels + Dots ---
      const labelRadius = getMidRadius(roundIndex);
      const fontSize = Math.max(8, 12 - roundIndex * 1.5); // Decrease font size for inner rounds

      // Helper to calculate label position and rotation
      function calculateLabelPos(midAngle) {
        const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
        const y = labelRadius * Math.sin(midAngle - Math.PI / 2);
        let rotation = (midAngle * 180) / Math.PI - 90; // Angle relative to vertical
        // Adjust rotation for labels on the left half to be readable
        if (rotation > 90 || rotation < -90) {
          rotation += 180;
        }
        return { x, y, rotation, angle: midAngle }; // Include angle for dot positioning
      }

      // Label and Position for Team A (Winner of Source Series A)
      const midAngleA = (infoA.startAngle + infoA.endAngle) / 2; // Midpoint of original slot
      const posA = calculateLabelPos(midAngleA);
      const isWinnerA = winnerA.name === seriesWinner.name;
      svg
        .append("text")
        .attr("class", "team-label")
        .attr("transform", `translate(${posA.x}, ${posA.y}) rotate(${posA.rotation})`)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("fill", "white")
        .style("font-size", `${fontSize}px`)
        .style("font-weight", isWinnerA ? "bold" : "normal") // Bold if winner of *current* series
        .text(winnerA.name);

      // Label and Position for Team B (Winner of Source Series B)
      const midAngleB = (infoB.startAngle + infoB.endAngle) / 2; // Midpoint of original slot
      const posB = calculateLabelPos(midAngleB);
      const isWinnerB = winnerB.name === seriesWinner.name;
      svg
        .append("text")
        .attr("class", "team-label")
        .attr("transform", `translate(${posB.x}, ${posB.y}) rotate(${posB.rotation})`)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("fill", "white")
        .style("font-size", `${fontSize}px`)
        .style("font-weight", isWinnerB ? "bold" : "normal") // Bold if winner of *current* series
        .text(winnerB.name);

      // --- Draw Game Dots ---
      // Dots represent the games won in the *current* series.
      // Place them near the label of the team that won *this* series.
      const winnerPositionForDots = isWinnerA ? posA : posB;
      // Need to pass radius to drawGameDots, use labelRadius
      winnerPositionForDots.radius = labelRadius;
      // The winner object needs to be the one from the *current* series data (contains gamesWon)
      drawGameDots(svg, seriesWinner, winnerPositionForDots, roundIndex);

      // --- Update tracking arrays (optional, for potential future use e.g., connectors) ---
      // Store the midpoint of the combined region this series represents
      const combinedStartAngle = Math.min(infoA.startAngle, infoB.startAngle);
      const combinedEndAngle = Math.max(infoA.endAngle, infoB.endAngle); // Crude, ignores wrap-around
      // TODO: Handle angle wrap-around if needed for combined midpoint calculation
      seriesMidpoints[roundNum][series.id] = {
        angle: (combinedStartAngle + combinedEndAngle) / 2, // Placeholder calculation
        radius: labelRadius,
      };
      // Store positions based on the individual winner arcs/labels
      teamPositions[roundNum][series.id] = {};
      teamPositions[roundNum][series.id][winnerA.name] = {
        ...posA,
        winner: isWinnerA,
        sourceSeriesId: sourceIdA,
      };
      teamPositions[roundNum][series.id][winnerB.name] = {
        ...posB,
        winner: isWinnerB,
        sourceSeriesId: sourceIdB,
      };
    });
  }

  // --- Draw Center Element (Final Winner/Trophy) ---
  const finalSeries = data.rounds[numRounds - 1].series[0];
  const champion = finalSeries.highSeed.winner ? finalSeries.highSeed : finalSeries.lowSeed;

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("fill", teamColors[champion.name] || defaultColor)
    .text(champion.name);

  // Add Year Label
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -outerRadius - 25)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text(`${data.year} NBA Playoffs`);
}

// --- Main Execution ---
// Fetch data (currently mock) and render
const playoffData = getMockPlayoffData();
renderBracket(playoffData);
