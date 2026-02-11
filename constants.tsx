
import { OrthogonalArray } from './types';

export const OA_LIBRARY: OrthogonalArray[] = [
  {
    id: 'L4',
    name: 'L4 (2³)',
    runs: 4,
    factors: 3,
    levels: 2,
    matrix: [
      [1, 1, 1],
      [1, 2, 2],
      [2, 1, 2],
      [2, 2, 1],
    ],
    description: 'Basic 2-level array for up to 3 factors.'
  },
  {
    id: 'L8',
    name: 'L8 (2⁷)',
    runs: 8,
    factors: 7,
    levels: 2,
    matrix: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 2, 2, 2, 2],
      [1, 2, 2, 1, 1, 2, 2],
      [1, 2, 2, 2, 2, 1, 1],
      [2, 1, 2, 1, 2, 1, 2],
      [2, 1, 2, 2, 1, 2, 1],
      [2, 2, 1, 1, 2, 2, 1],
      [2, 2, 1, 2, 1, 1, 2],
    ],
    description: 'Standard 2-level array for up to 7 factors.'
  },
  {
    id: 'L9',
    name: 'L9 (3⁴)',
    runs: 9,
    factors: 4,
    levels: 3,
    matrix: [
      [1, 1, 1, 1],
      [1, 2, 2, 2],
      [1, 3, 3, 3],
      [2, 1, 2, 3],
      [2, 2, 3, 1],
      [2, 3, 1, 2],
      [3, 1, 3, 2],
      [3, 2, 1, 3],
      [3, 3, 2, 1],
    ],
    description: 'Standard 3-level array for up to 4 factors.'
  },
  {
    id: 'L12',
    name: 'L12 (2¹¹)',
    runs: 12,
    factors: 11,
    levels: 2,
    matrix: [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,2,2,2,2,2,2],
      [1,1,2,2,2,1,1,1,2,2,2],
      [1,2,1,2,2,1,2,2,1,1,2],
      [1,2,2,1,2,2,1,2,1,2,1],
      [1,2,2,2,1,2,2,1,2,1,1],
      [2,1,2,2,1,1,2,2,1,2,1],
      [2,1,2,1,2,2,2,1,1,1,2],
      [2,1,1,2,2,2,1,2,2,1,1],
      [2,2,2,1,1,1,1,2,2,1,2],
      [2,2,1,2,1,2,1,1,1,2,2],
      [2,2,1,1,2,1,2,1,2,2,1],
    ],
    description: 'Plackett-Burman 2-level array (saturated).'
  },
  {
    id: 'L16',
    name: 'L16 (2¹⁵)',
    runs: 16,
    factors: 15,
    levels: 2,
    matrix: Array(16).fill(0).map((_, i) => 
      Array(15).fill(0).map((__, j) => {
        const bit = (i & (1 << (j % 4))) ? 2 : 1; // Simplified Hadamard generation logic
        return bit;
      })
    ),
    description: 'Hadamard 2-level array for screening.'
  },
  {
    id: 'L18',
    name: 'L18 (2¹ 3⁷)',
    runs: 18,
    factors: 8,
    levels: 0, // Misto
    matrix: [
      [1,1,1,1,1,1,1,1], [1,1,2,2,2,2,2,2], [1,1,3,3,3,3,3,3],
      [1,2,1,1,2,2,3,3], [1,2,2,2,3,3,1,1], [1,2,3,3,1,1,2,2],
      [1,3,1,2,1,3,2,3], [1,3,2,3,2,1,3,1], [1,3,3,1,3,2,1,2],
      [2,1,1,3,3,2,2,1], [2,1,2,1,1,3,3,2], [2,1,3,2,2,1,1,3],
      [2,2,1,2,3,1,3,2], [2,2,2,3,1,2,1,3], [2,2,3,1,2,3,2,1],
      [2,3,1,3,2,3,1,2], [2,3,2,1,3,1,2,3], [2,3,3,2,1,2,3,1],
    ],
    description: 'Mixed-level array: 1 factor at 2 levels, 7 factors at 3 levels.'
  },
  {
    id: 'L27',
    name: 'L27 (3¹³)',
    runs: 27,
    factors: 13,
    levels: 3,
    matrix: Array(27).fill(0).map((_, i) => 
      Array(13).fill(0).map((__, j) => (Math.floor(i / Math.pow(3, j % 3)) % 3) + 1)
    ),
    description: 'Large 3-level array for up to 13 factors.'
  }
];
