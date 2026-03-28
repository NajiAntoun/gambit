import type { Deviation } from './types';

/**
 * Known opponent deviations for Drill mode.
 * Keyed by opening ID. Each deviation has been validated against chess.js.
 *
 * atMoveIndex = the index in opening.moves where the opponent's book move
 * gets replaced by the deviation. The deviation is always an opponent move
 * (Black for White openings, White for Black openings).
 */
export const deviationsByOpening: Record<string, Deviation[]> = {

  // ─── WHITE OPENINGS ────────────────────────────────────────────────────────

  'ruy-lopez': [
    {
      atMoveIndex: 3, // Book: 2...Nc6. Deviation: 2...d6 (Steinitz Defense)
      move: 'd6',
      label: 'Steinitz Defense',
      deviationExplanation: 'Black plays the passive Steinitz Defense. While solid, it blocks the dark-squared bishop and concedes the center too easily.',
      correctResponse: 'd4',
      responseExplanation: 'Seize the center immediately! With d4, White gains a powerful pawn duo and takes full control. Black\'s d6 pawn blocks the bishop, making it hard to fight back.',
    },
    {
      atMoveIndex: 9, // Book: 5...a6. Deviation: 5...Nd4 (Bird Defense)
      move: 'Nd4',
      label: 'Bird Defense',
      deviationExplanation: 'Black jumps to d4, attacking the bishop on b5 and the knight on f3. Looks aggressive but wastes time.',
      correctResponse: 'Nxd4',
      responseExplanation: 'Simply capture! After Nxd4 exd4, White has traded a well-placed knight for Black\'s active one, and Black\'s pawn structure is damaged.',
    },
  ],

  'italian-game': [
    {
      atMoveIndex: 5, // Book: 3...Bc5. Deviation: 3...Nf6 (Two Knights)
      move: 'Nf6',
      label: 'Two Knights Defense',
      deviationExplanation: 'Black develops the knight instead of the bishop, entering the Two Knights Defense. This is a valid line but invites White\'s sharp initiative.',
      correctResponse: 'd4',
      responseExplanation: 'Strike the center with d4! White opens lines for the pieces and takes advantage of Black not having the bishop on c5 to pressure d4.',
    },
    {
      atMoveIndex: 9, // Book: 3...Bc5 (after Bc4). Deviation: 3...d6 (passive)
      move: 'd6',
      label: 'Passive d6',
      deviationExplanation: 'Black plays passively with d6 instead of developing a piece. This allows White to build the ideal pawn center without resistance.',
      correctResponse: 'Ng5',
      responseExplanation: 'Attack f7 with Ng5! The knight targets the weak f7 square alongside the bishop on c4. Black\'s passive d6 didn\'t develop any pieces, and now faces a dangerous tactical threat.',
    },
  ],

  'queens-gambit': [
    {
      atMoveIndex: 5, // Book: 2...e6. Deviation: 2...dxc4 (QGA)
      move: 'dxc4',
      label: 'Queen\'s Gambit Accepted',
      deviationExplanation: 'Black grabs the c4 pawn, accepting the gambit. The pawn can\'t be held long-term, and Black falls behind in development.',
      correctResponse: 'e4',
      responseExplanation: 'Seize the center with e4! White gets a powerful central pawn duo. The c4 pawn is hard for Black to defend, and White\'s pieces will develop naturally.',
    },
    {
      atMoveIndex: 9, // Book: 3...Nf6. Deviation: 3...c6 (Semi-Slav setup)
      move: 'c6',
      label: 'Early Semi-Slav',
      deviationExplanation: 'Black plays c6 before developing the knight, entering Semi-Slav territory. Solid but slow.',
      correctResponse: 'e4',
      responseExplanation: 'Push e4 before Black completes development! White gets the ideal pawn center and opens lines for the pieces. The tempo advantage is real.',
    },
  ],

  'london-system': [
    {
      atMoveIndex: 3, // Book: 1...d5. Deviation: 1...Nf6
      move: 'Nf6',
      label: 'Knight first',
      deviationExplanation: 'Black develops the knight before committing the d-pawn. This is common but allows the London to deploy without challenge.',
      correctResponse: 'Bf4',
      responseExplanation: 'Continue with the London system! Bf4 is the signature move — the bishop goes outside the pawn chain before e3 locks it in. The setup works regardless of Black\'s move order.',
    },
    {
      atMoveIndex: 5, // Book: 2...Nf6. Deviation: 2...c5
      move: 'c5',
      label: 'Early c5 challenge',
      deviationExplanation: 'Black immediately challenges the d4 pawn. This is a principled response but the London has a solid answer.',
      correctResponse: 'e3',
      responseExplanation: 'Reinforce d4 with e3! The London\'s solid pawn structure handles the c5 challenge easily. White\'s bishop on f4 is already developed, and the position remains stable.',
    },
  ],

  'scotch-game': [
    {
      atMoveIndex: 7, // Book: 4...Nf6. Deviation: 4...Nxd4
      move: 'Nxd4',
      label: 'Knight captures d4',
      deviationExplanation: 'Black captures the knight instead of developing. This simplifies the position and gives White easy equality with a centralized queen.',
      correctResponse: 'Qxd4',
      responseExplanation: 'Recapture with the queen! The queen sits powerfully on d4, centralized and attacking. Black has traded an active knight for White\'s well-placed one, and White develops effortlessly.',
    },
  ],

  'kings-gambit': [
    {
      atMoveIndex: 5, // Book: 2...exf4 (Accepted). Deviation: 2...d5 (Falkbeer Counter-Gambit)
      move: 'd5',
      label: 'Falkbeer Counter-Gambit',
      deviationExplanation: 'Black counter-sacrifices a pawn instead of accepting! The Falkbeer aims to seize the initiative, but White has a strong reply.',
      correctResponse: 'exd5',
      responseExplanation: 'Accept the pawn! After exd5, White is a pawn up and the f4 pawn is still there for Black to take. White can develop quickly and maintain the extra material.',
    },
  ],

  'vienna-game': [
    {
      atMoveIndex: 3, // Book: 1...e5. Deviation: 1...Nf6
      move: 'Nf6',
      label: 'Knight defense',
      deviationExplanation: 'Black develops the knight instead of 1...e5. This sidesteps the main Vienna lines but allows White to push aggressively.',
      correctResponse: 'f4',
      responseExplanation: 'Push f4! White launches the Vienna Gambit immediately, seizing space and attacking the center. The knight on f6 can\'t prevent White\'s aggressive central expansion.',
    },
  ],

  // ─── BLACK vs e4 ───────────────────────────────────────────────────────────

  'french-defense': [
    {
      atMoveIndex: 4, // Book: 3.Nc3. Deviation: 3.Bd3
      move: 'Bd3',
      label: 'Bishop blocks d-file',
      deviationExplanation: 'White develops the bishop to d3, but this blocks the d-pawn and makes it impossible to recapture on e4 with the pawn.',
      correctResponse: 'dxe4',
      responseExplanation: 'Capture on e4! The bishop on d3 blocks White\'s recapture with Bxe4 requiring a second bishop move. Black wins a central pawn and opens the position favorably.',
    },
    {
      atMoveIndex: 2, // Book: 2.d4. Deviation: 2.e5 (Advance premature)
      move: 'e5',
      label: 'Premature Advance',
      deviationExplanation: 'White pushes e5 without d4 first. This gains space but commits the center prematurely without full piece support.',
      correctResponse: 'd5',
      responseExplanation: 'Claim space with d5! Black gets a strong pawn on d5 and will follow with c5 to undermine the e5 pawn. Without d4 support, White\'s e5 pawn becomes a target.',
    },
  ],

  'caro-kann': [
    {
      atMoveIndex: 4, // Book: 3.Nc3. Deviation: 3.f3 (Fantasy Variation)
      move: 'f3',
      label: 'Fantasy Variation',
      deviationExplanation: 'White plays the aggressive Fantasy Variation, supporting e4 with f3. Ambitious but weakens the kingside.',
      correctResponse: 'dxe4',
      responseExplanation: 'Capture on e4! After fxe4, White\'s kingside is severely weakened with the f-file torn open. Black can target these weaknesses with Qh4+ ideas.',
    },
    {
      atMoveIndex: 2, // Book: 2.d4. Deviation: 2.Nc3
      move: 'Nc3',
      label: 'Two Knights setup',
      deviationExplanation: 'White develops the knight instead of playing d4. This sidesteps the main Caro-Kann but gives Black a free hand in the center.',
      correctResponse: 'd5',
      responseExplanation: 'Push d5 immediately! Without d4, White has less central control. Black gets the ideal Caro-Kann pawn structure and can develop freely.',
    },
  ],

  'sicilian-najdorf': [
    {
      atMoveIndex: 8, // Book: 5.Nc3. Deviation: 5.f3 (instead of Nc3)
      move: 'f3',
      label: 'Aggressive f3',
      deviationExplanation: 'White plays f3, supporting e4 but delaying development. This is the English Attack idea but played early.',
      correctResponse: 'e5',
      responseExplanation: 'Strike the center with e5! The knight on d4 is challenged and White hasn\'t developed enough to punish this central advance. Black gets active counterplay.',
    },
  ],

  'sicilian-dragon': [
    {
      atMoveIndex: 8, // Book: 5.Nc3. Similar deviation
      move: 'f3',
      label: 'Early f3',
      deviationExplanation: 'White plays f3 to support e4 aggressively. But this delays development and weakens the kingside.',
      correctResponse: 'e5',
      responseExplanation: 'Push e5! Challenge the center immediately while White is behind in development. The d4 knight is unstable and Black seizes the initiative.',
    },
  ],

  'scandinavian': [
    {
      atMoveIndex: 6, // Book: 3.Nc3. Deviation: 3.d4
      move: 'd4',
      label: 'Early d4',
      deviationExplanation: 'White pushes d4 before developing the knight. This gives Black a clear target to develop against.',
      correctResponse: 'Nc6',
      responseExplanation: 'Develop the knight to c6! It pressures d4 immediately and develops a piece with tempo. White\'s center becomes a target rather than a strength.',
    },
  ],

  'kings-indian-defense': [
    {
      atMoveIndex: 8, // Book: 5.Nf3. Deviation: 5.f3 (Sämisch)
      move: 'f3',
      label: 'Sämisch Variation',
      deviationExplanation: 'White plays the Sämisch with f3, bolstering e4 but weakening the kingside. This is a major alternative but Black has a clear plan.',
      correctResponse: 'e5',
      responseExplanation: 'Strike with e5! The Sämisch weakens White\'s king position. Black gets the standard KID counterattack but with extra punch since f3 has already weakened the kingside.',
    },
  ],

  'petroff-defense': [
    {
      atMoveIndex: 8, // Book: 4.d4 (after Nf3 Nxe4). Deviation: 4.Nc3
      move: 'Nc3',
      label: 'Knight instead of d4',
      deviationExplanation: 'White develops the knight instead of pushing d4. This is less ambitious and lets Black keep the strong knight on e4.',
      correctResponse: 'Nxc3',
      responseExplanation: 'Trade the knight! After Nxc3 dxc3, Black has damaged White\'s pawn structure. White\'s doubled c-pawns are a permanent weakness, and Black can develop comfortably.',
    },
  ],

  'alekhines-defense': [
    {
      atMoveIndex: 4, // Book: 3.d4. Deviation: 3.Nc3 (doesn't chase)
      move: 'Nc3',
      label: 'Passive Nc3',
      deviationExplanation: 'White develops the knight instead of pushing d4. This gives Alekhine\'s Defense exactly what it wants — a target on e5 without a strong center behind it.',
      correctResponse: 'd6',
      responseExplanation: 'Attack e5 immediately with d6! Without d4 to support it, the e5 pawn is weak. Black undermines White\'s center — the whole point of Alekhine\'s strategy.',
    },
  ],

  // ─── BLACK vs d4 ───────────────────────────────────────────────────────────

  'nimzo-indian': [
    {
      atMoveIndex: 4, // Book: 3.Nc3. Deviation: 3.Nf3 (avoids Nimzo)
      move: 'Nf3',
      label: 'Avoids the Nimzo',
      deviationExplanation: 'White plays Nf3 to avoid the Nimzo-Indian pin on Nc3. This is a major sideline but Black can transpose to strong setups.',
      correctResponse: 'Bb4+',
      responseExplanation: 'Check with Bb4+! Since there\'s no knight on c3, the bishop gives check via d2. White must block awkwardly, and Black gets the initiative.',
    },
  ],

  'grunfeld-defense': [
    {
      atMoveIndex: 4, // Book: 3.Nc3. Deviation: 3.Nf3
      move: 'Nf3',
      label: 'Quiet Nf3',
      deviationExplanation: 'White plays Nf3 instead of Nc3, avoiding the main Grünfeld lines. Less aggressive but allows Black a free hand.',
      correctResponse: 'Bg7',
      responseExplanation: 'Fianchetto the bishop! With Bg7, Black completes the Grünfeld setup. The bishop on g7 will be a monster on the long diagonal, and d5 will come with full force.',
    },
  ],

  'queens-indian': [
    {
      atMoveIndex: 4, // Book: 3.Nf3. Deviation: 3.Nc3 (transposes to Nimzo territory)
      move: 'Nc3',
      label: 'Nc3 instead of Nf3',
      deviationExplanation: 'White plays Nc3, inviting a Nimzo-Indian. But if you wanted the Queen\'s Indian, you can still get a good game.',
      correctResponse: 'Bb4',
      responseExplanation: 'Pin the knight with Bb4! This transposes into a favorable Nimzo-Indian setup. The pin on c3 is annoying for White and gives Black easy development.',
    },
  ],

  'dutch-defense': [
    {
      atMoveIndex: 2, // Book: 2.c4. Deviation: 2.Bg5 (aggressive anti-Dutch)
      move: 'Bg5',
      label: 'Anti-Dutch Bg5',
      deviationExplanation: 'White tries the aggressive Bg5, pinning nothing but hoping to provoke weaknesses. This is a sideline designed to throw off Dutch players.',
      correctResponse: 'd5',
      responseExplanation: 'Claim the center with d5! Black gets a strong central presence. The bishop on g5 has no real target and will need to retreat, wasting White\'s tempo.',
    },
  ],

  'modern-benoni': [
    {
      atMoveIndex: 4, // Book: 3.d5. Deviation: 3.dxc5
      move: 'dxc5',
      label: 'Captures on c5',
      deviationExplanation: 'White captures on c5 instead of advancing d5. This gives up the central tension and lets Black equalize easily.',
      correctResponse: 'e6',
      responseExplanation: 'Play e6! Black will recapture the c5 pawn easily and develop the bishop to reclaim the pawn. White has given up the center for nothing.',
    },
  ],
};
