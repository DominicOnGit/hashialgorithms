import type { Story } from '../story';

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
  `
};

const Intro2: Story = {
  id: 'Intro2',
  title: 'Hashi Algorithm',
  text: `
    But this is not a traditional Hashi game. You don't have to solve the puzzle yourself. You let the computer do it for you!
    You just have to write the algorithm to tell the computer how to solve a hashi.

    Sometimes the solution for a part of the puzzle is easy to see. 
    E.g. if there is an island that needs 4 bridges, and that island has only two neighbouring islands, then we need to connect both neighbours with double bridges.

    Let's try to formulate this rule as an algorithm:

    `
};

const Terminology: Story = {
  id: 'Terminology',
  title: 'Terminology',
  text: `
  In the world of algorithms, there is a mathematical object that describes islands and bridges of Hashi: a graph.
  A graph consists of vertices and edges. An edge is a connection between two vertices.   
    `
};

Intro1.next = Intro2;

export const Stories: Record<string, Story> = {
  [Intro1.id]: Intro1,
  [Intro2.id]: Intro2
};
