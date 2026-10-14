# r10 hidden-cell restoration - per-cell evidence (r3: ">=2 poses agree" rule)

Effect palette (overlay colours, never counted as votes): `#5f62c1` `#ae387d` `#cc5282` `#e1a639` `#ff87c6` `#ffcced` (by pose: happy #ae387d/#cc5282/#ff87c6/#ffcced; shock #e1a639; awkward #5f62c1).

Hair/braid palette seen in visible phone-pose braid: `#5bb4e2` `#7b5f80` `#a57ee6` `#c4a3ef` `#d94cb4` `#ddbfee` `#edcca1` `#eedcee` `#f1ede0`.

Row alignment: happy/shock identity; awkward dy=+1 for phone rows 6..14 (identity from row 15). Rule: copy a colour into char-back iff >=2 of the 3 other poses give the same non-effect colour at that cell. "agree" = number of identical colour votes.

Verdicts over 79 phone-covered cells: restore=21, empty=58; restored=21 (3-agree 15, 2-agree 6); single-vote=0; conflict=0.

Audit of the r2 union rule against the >=2 rule: r2 restores that are NOT >=2 agree = 0; >=2-agree cells that r2 did not restore = 0.

2-agree cells (the only ones that rely on a single pair of poses): (18,11)#7b5f80 (17,12)#c4a3ef (18,12)#7b5f80 (17,13)#c4a3ef (18,13)#7b5f80 (18,14)#7b5f80. Of these the ones that need the awkward row shift to reach 2: (18,11) (17,12) (18,12) (17,13) (18,13) (18,14).

| cell (x,y) | phone px | happy | shock | awkward | agree | r2 union | r3 verdict | colour |
|---|---|---|---|---|---|---|---|---|
| (18,8) shared-ear | #7b5f80 | color:#7b5f80 | color:#7b5f80 | color:#7b5f80 | 3 | restore | restore | #7b5f80 |
| (19,8) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (21,8) | #7b5f80 | bg | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (22,8) | #7b5f80 | bg | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (18,9) | #7b5f80 | color:#d94cb4 | color:#d94cb4 | color:#d94cb4 | 3 | restore | restore | #d94cb4 |
| (19,9) | #ea5276 | color:#7b5f80 | color:#7b5f80 | color:#7b5f80 | 3 | restore | restore | #7b5f80 |
| (20,9) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (21,9) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (22,9) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,10) x17 | #7b5f80 | color:#ddbfee | color:#ddbfee | color:#ddbfee | 3 | restore | restore | #ddbfee |
| (18,10) | #7b5f80 | color:#d94cb4 | color:#d94cb4 | color:#d94cb4 | 3 | restore | restore | #d94cb4 |
| (19,10) | #7b5f80 | color:#7b5f80 | color:#7b5f80 | color:#7b5f80 | 3 | restore | restore | #7b5f80 |
| (20,10) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (21,10) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (22,10) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (23,10) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,11) x17 | #7b5f80 | color:#ddbfee | color:#ddbfee | color:#ddbfee | 3 | restore | restore | #ddbfee |
| (18,11) | #ff7baf | effect:#ae387d | color:#7b5f80 | color:#7b5f80 | 2 | restore | restore | #7b5f80 |
| (19,11) | #ff7baf | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (20,11) | #ff7baf | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (21,11) | #ff7baf | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (22,11) | #ff7baf | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (23,11) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,12) x17 | #7b5f80 | effect:#ae387d | color:#c4a3ef | color:#c4a3ef | 2 | restore | restore | #c4a3ef |
| (18,12) | #ff7baf | effect:#ffcced | color:#7b5f80 | color:#7b5f80 | 2 | restore | restore | #7b5f80 |
| (19,12) | #ea5276 | effect:#ff87c6 | bg | bg | 0 | empty-confirmed | empty | - |
| (20,12) | #ea5276 | effect:#ae387d | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (21,12) | #ea5276 | effect:#ffcced | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (22,12) | #ea5276 | effect:#ff87c6 | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (23,12) | #7b5f80 | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (17,13) x17 | #7b5f80 | effect:#ae387d | color:#c4a3ef | color:#c4a3ef | 2 | restore | restore | #c4a3ef |
| (18,13) | #ff7baf | effect:#ff87c6 | color:#7b5f80 | color:#7b5f80 | 2 | restore | restore | #7b5f80 |
| (19,13) | #ea5276 | effect:#ff87c6 | bg | bg | 0 | empty-confirmed | empty | - |
| (20,13) | #ea5276 | effect:#ff87c6 | bg | bg | 0 | empty-confirmed | empty | - |
| (21,13) | #ea5276 | effect:#ff87c6 | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (22,13) | #ea5276 | effect:#cc5282 | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (23,13) | #7b5f80 | effect:#ae387d | effect:#e1a639 | bg | 0 | empty-confirmed | empty | - |
| (17,14) x17 | #7b5f80 | color:#c4a3ef | color:#c4a3ef | color:#c4a3ef | 3 | restore | restore | #c4a3ef |
| (18,14) | #ff7baf | effect:#ae387d | color:#7b5f80 | color:#7b5f80 | 2 | restore | restore | #7b5f80 |
| (19,14) | #ea5276 | effect:#ff87c6 | bg | bg | 0 | empty-confirmed | empty | - |
| (20,14) | #ea5276 | effect:#cc5282 | bg | bg | 0 | empty-confirmed | empty | - |
| (21,14) | #ea5276 | effect:#cc5282 | bg | bg | 0 | empty-confirmed | empty | - |
| (22,14) | #ea5276 | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (23,14) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,15) x17 | #7b5f80 | color:#c4a3ef | color:#c4a3ef | color:#c4a3ef | 3 | restore | restore | #c4a3ef |
| (18,15) | #ff7baf | color:#7b5f80 | color:#7b5f80 | color:#7b5f80 | 3 | restore | restore | #7b5f80 |
| (19,15) | #ea5276 | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (20,15) | #ea5276 | effect:#cc5282 | bg | bg | 0 | empty-confirmed | empty | - |
| (21,15) | #ea5276 | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (22,15) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (23,15) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,16) x17 | #7b5f80 | color:#c4a3ef | color:#c4a3ef | color:#c4a3ef | 3 | restore | restore | #c4a3ef |
| (18,16) | #ff7baf | color:#7b5f80 | color:#7b5f80 | color:#7b5f80 | 3 | restore | restore | #7b5f80 |
| (19,16) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (20,16) | #ea5276 | effect:#ae387d | bg | bg | 0 | empty-confirmed | empty | - |
| (21,16) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (22,16) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (23,16) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,17) x17 | #7b5f80 | color:#c4a3ef | color:#c4a3ef | color:#c4a3ef | 3 | restore | restore | #c4a3ef |
| (18,17) | #ff7baf | color:#7b5f80 | color:#7b5f80 | color:#7b5f80 | 3 | restore | restore | #7b5f80 |
| (19,17) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (20,17) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (21,17) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (22,17) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (23,17) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,18) x17 | #7b5f80 | color:#7b5f80 | color:#7b5f80 | color:#7b5f80 | 3 | restore | restore | #7b5f80 |
| (18,18) | #ff7baf | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (19,18) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (20,18) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (21,18) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (22,18) | #ea5276 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (23,18) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (17,19) x17 | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (18,19) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (19,19) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (20,19) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (21,19) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (22,19) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |
| (23,19) | #7b5f80 | bg | bg | bg | 0 | empty-confirmed | empty | - |

## Left-edge region scan x=14..19, y=6..19 (char-back holes)

cells=84, holes=0, status counts: {"visible-source":46,"bg-confirmed":17,"filled-by-consensus":21}; whole-canvas transparent-with-consensus cells: 0.

| cell | phone | char-back | phone-front | consensus (agree) | status |
|---|---|---|---|---|---|
| (14,6) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (15,6) | #eedcee | #eedcee | - | #eedcee (3) | visible-source |
| (16,6) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (17,6) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (18,6) | #7b5f80 | #7b5f80 | - | #7b5f80 (3) | visible-source |
| (19,6) | - | - | - | bg (0) | bg-confirmed |
| (14,7) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (15,7) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (16,7) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (17,7) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (18,7) | #7b5f80 | #7b5f80 | - | #7b5f80 (3) | visible-source |
| (19,7) | - | - | - | bg (0) | bg-confirmed |
| (14,8) | #ddbfee | #ddbfee | - | #ddbfee (3) | visible-source |
| (15,8) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (16,8) | #ddbfee | #ddbfee | - | #ddbfee (3) | visible-source |
| (17,8) | #ddbfee | #ddbfee | - | #ddbfee (3) | visible-source |
| (18,8) | #7b5f80 | #7b5f80 | #7b5f80 | #7b5f80 (3) | filled-by-consensus |
| (19,8) | #7b5f80 | - | #7b5f80 | bg (0) | bg-confirmed |
| (14,9) | #ddbfee | #ddbfee | - | #ddbfee (3) | visible-source |
| (15,9) | #d94cb4 | #d94cb4 | - | #d94cb4 (3) | visible-source |
| (16,9) | #d94cb4 | #d94cb4 | - | #d94cb4 (3) | visible-source |
| (17,9) | #eedcee | #eedcee | - | #eedcee (3) | visible-source |
| (18,9) | #7b5f80 | #d94cb4 | #7b5f80 | #d94cb4 (3) | filled-by-consensus |
| (19,9) | #ea5276 | #7b5f80 | #ea5276 | #7b5f80 (3) | filled-by-consensus |
| (14,10) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (15,10) | #d94cb4 | #d94cb4 | - | #d94cb4 (3) | visible-source |
| (16,10) | #d94cb4 | #d94cb4 | - | #d94cb4 (3) | visible-source |
| (17,10) | #7b5f80 | #ddbfee | #7b5f80 | #ddbfee (3) | filled-by-consensus |
| (18,10) | #7b5f80 | #d94cb4 | #7b5f80 | #d94cb4 (3) | filled-by-consensus |
| (19,10) | #7b5f80 | #7b5f80 | #7b5f80 | #7b5f80 (3) | filled-by-consensus |
| (14,11) | #7b5f80 | #7b5f80 | - | - (1) | visible-source |
| (15,11) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (16,11) | #ddbfee | #ddbfee | - | #ddbfee (3) | visible-source |
| (17,11) | #7b5f80 | #ddbfee | #7b5f80 | #ddbfee (3) | filled-by-consensus |
| (18,11) | #ff7baf | #7b5f80 | #ff7baf | #7b5f80 (2) | filled-by-consensus |
| (19,11) | #ff7baf | - | #ff7baf | bg (0) | bg-confirmed |
| (14,12) | #6673aa | #6673aa | - | - (1) | visible-source |
| (15,12) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (16,12) | #ddbfee | #ddbfee | - | #ddbfee (3) | visible-source |
| (17,12) | #7b5f80 | #c4a3ef | #7b5f80 | #c4a3ef (2) | filled-by-consensus |
| (18,12) | #ff7baf | #7b5f80 | #ff7baf | #7b5f80 (2) | filled-by-consensus |
| (19,12) | #ea5276 | - | #ea5276 | bg (0) | bg-confirmed |
| (14,13) | #87a5d9 | #87a5d9 | - | - (1) | visible-source |
| (15,13) | #a57ee6 | #a57ee6 | - | #a57ee6 (2) | visible-source |
| (16,13) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (17,13) | #7b5f80 | #c4a3ef | #7b5f80 | #c4a3ef (2) | filled-by-consensus |
| (18,13) | #ff7baf | #7b5f80 | #ff7baf | #7b5f80 (2) | filled-by-consensus |
| (19,13) | #ea5276 | - | #ea5276 | bg (0) | bg-confirmed |
| (14,14) | #bbddff | #bbddff | - | - (1) | visible-source |
| (15,14) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (16,14) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (17,14) | #7b5f80 | #c4a3ef | #7b5f80 | #c4a3ef (3) | filled-by-consensus |
| (18,14) | #ff7baf | #7b5f80 | #ff7baf | #7b5f80 (2) | filled-by-consensus |
| (19,14) | #ea5276 | - | #ea5276 | bg (0) | bg-confirmed |
| (14,15) | #f4b7d9 | #f4b7d9 | - | #f4b7d9 (2) | visible-source |
| (15,15) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (16,15) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (17,15) | #7b5f80 | #c4a3ef | #7b5f80 | #c4a3ef (3) | filled-by-consensus |
| (18,15) | #ff7baf | #7b5f80 | #ff7baf | #7b5f80 (3) | filled-by-consensus |
| (19,15) | #ea5276 | - | #ea5276 | bg (0) | bg-confirmed |
| (14,16) | #7b5f80 | #7b5f80 | - | #7b5f80 (3) | visible-source |
| (15,16) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (16,16) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (17,16) | #7b5f80 | #c4a3ef | #7b5f80 | #c4a3ef (3) | filled-by-consensus |
| (18,16) | #ff7baf | #7b5f80 | #ff7baf | #7b5f80 (3) | filled-by-consensus |
| (19,16) | #ea5276 | - | #ea5276 | bg (0) | bg-confirmed |
| (14,17) | #7b5f80 | #7b5f80 | - | #7b5f80 (3) | visible-source |
| (15,17) | #a57ee6 | #a57ee6 | - | #a57ee6 (3) | visible-source |
| (16,17) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (17,17) | #7b5f80 | #c4a3ef | #7b5f80 | #c4a3ef (3) | filled-by-consensus |
| (18,17) | #ff7baf | #7b5f80 | #ff7baf | #7b5f80 (3) | filled-by-consensus |
| (19,17) | #ea5276 | - | #ea5276 | bg (0) | bg-confirmed |
| (14,18) | - | - | - | bg (0) | bg-confirmed |
| (15,18) | #7b5f80 | #7b5f80 | - | #7b5f80 (3) | visible-source |
| (16,18) | #c4a3ef | #c4a3ef | - | #c4a3ef (3) | visible-source |
| (17,18) | #7b5f80 | #7b5f80 | #7b5f80 | #7b5f80 (3) | filled-by-consensus |
| (18,18) | #ff7baf | - | #ff7baf | bg (0) | bg-confirmed |
| (19,18) | #ea5276 | - | #ea5276 | bg (0) | bg-confirmed |
| (14,19) | - | - | - | bg (0) | bg-confirmed |
| (15,19) | #7b5f80 | #7b5f80 | - | #7b5f80 (3) | visible-source |
| (16,19) | #7b5f80 | #7b5f80 | - | #7b5f80 (3) | visible-source |
| (17,19) | #7b5f80 | - | #7b5f80 | bg (0) | bg-confirmed |
| (18,19) | #7b5f80 | - | #7b5f80 | bg (0) | bg-confirmed |
| (19,19) | #7b5f80 | - | #7b5f80 | bg (0) | bg-confirmed |

## Tap frames 3 and 5 (phone-front shifted +1)

checked: {"x14to17":56,"coveredByPhone":79,"transparentExplained":14}; issues=0; left ear complete=true (r2 front without (18,8): complete=false, issues=none); x=17 column rows 8..19: #ddbfee #eedcee #ddbfee #ddbfee #c4a3ef #c4a3ef #c4a3ef #c4a3ef #c4a3ef #c4a3ef #7b5f80 -; phone-bezel colour on x=17 rows: 18; x=16 changed rows vs idle: none.
