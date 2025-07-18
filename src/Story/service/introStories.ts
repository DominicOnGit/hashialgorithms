import type { Level } from '@/Title-Screen/stores/level';
import { type Story } from '../story';
import { DoubleBigSquare } from '@/Title-Screen/services/levels';
import Intro1Pic from '@/assets/mix2Sln.png';

const Intro1: Story = {
  id: 'Intro1',
  title: 'Hashi',
  text: `
Hashi is a puzzle game. The goal is to connect the islands (circles) by drawing bridges between them. 
<ul>
  <li> Bridges can only be drawn horizontally or vertically. They cannot cross each other.</li>
  <li>Each island has number (from 1 to 8) giving the number of bridges that must connect to this island.</li>
  <li>At most two bridges can connect a pair of islands.</li>
  <li>Finally, all islands must be connected into one group.</li>
</ul>
  `,
  pic: Intro1Pic
};

const Intro2: Story = {
  id: 'Intro2',
  title: 'Hashi Algorithm',
  text: `
    But this is not a traditional Hashi game. You don't have to solve the puzzle yourself. You let the computer do it for you!
    You just have to write the algorithm to tell the computer how to solve a hashi.
<br/>
    Here, an algorithm conists of a set of rules. 
    A rule is an instruction of the form 'Find an island satisfying some condition. Then find a bridge to that island with some other condition. Then do something with that bridge, like drawing a second bridge.'
<br/>
    The algorithm will run as long as it has a rule that finds a matching island.
    `
};

const Terminology: Story = {
  id: 'Terminology',
  title: 'Terminology',
  text: `
  In the world of algorithms, there is a mathematical object that describes the islands and bridges of Hashi: a graph.
  <br/>
  A graph consists of vertices and edges. An edge is a connection between two vertices.   
  Two vertices cannot be connected by more than one edge, but we can give the edge a <em>multiplicity</em> property. Thus, a double bridge is represented as multiplicity 2.
  An edge with multiplicity 0 means that the two vertices could be connected by a bridge, but the bridge is not yet drawn.
<br/>

The number of bridges an island needs is represented as the <em>targetDegree</em> property of the vertex. The degree of the vertex is the sum of the multiplicity of all edges of that vertex.  
    `
};

const FirstAlgorithm: Story = {
  id: 'FirstAlgorithm',
  title: 'A First Algorithm',
  text: `
Sometimes the solution for a part of the puzzle is easy to see. E.g. if there is an island that
needs 4 bridges, and that island has only two neighbouring islands, then we need to connect both
neighbours with double bridges.
<br />
Let's try to formulate this rule as an algorithm:
<ol>
  <li>
    Find a vertex
    <ul>
      <li>with targetDegree 4</li>
      <li>and two incident edges</li>
    </ul>
  </li>
  <li>
    then select one of the incident edges
    <ul>
      <li>that has multiplicity less than 2</li>
    </ul>
  </li>
  <li>then increment the multiplicty of that edge</li>
</ol>
    `
};

export const IntroPreLevelSequences: [Level, Story[]] = [
  DoubleBigSquare,
  [Intro1, Intro2, Terminology, FirstAlgorithm]
];
