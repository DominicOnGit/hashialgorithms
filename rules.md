# possible rules

## Need two brides (Need2Bridges)

Vertex with @targetDegree = 2\*|incident edges|
-> set 2 bridges on all incident edges

Edge with multi < 2
and adjacent vertex with
@targetDegree = $\Sigma_{adjacent edges} 2$
-> set 2 bridges

### generalized with maxMultiplicity (NeedMaxMultiplicity)

Edge with multiplicity < maxMultiplicity
and incident vertex with
@targetDegree = $\Sigma_{adjacent edges} maxMultiplicity(e)$
-> set mult = maxMultiplicity

## Need at least one bridge (NeedAtLeastOneBridge)

Vertex with @targetDegree > 2* (|incident edges| - 1)
equiv @targetDegree > 2*|incident edges| -2
equiv @targetDegree +2 > 2*|incident edges|
equiv @targetDegree +1 >= 2*|incident edges|
equiv @targetDegree > 2\*|other incident edges|

Edge with mult = 0
and adjacent Vertex with
@targetDegree + 1 >= 2\*|incident edges|
-> set 1 bridge

### Need at least one bridge due to maxMultiplicity (NeedAtLeastOneBridgeMaxMulti)

Edge with multiplicity = 0
and incident vertex with
@targetDegree > $\Sigma_{other adjacent edges} maxMultiplicity(e)$
-> set mult = 1

## Set MaxMulti if remaining degree is 0

Vertex with targetDegree = degree
incident edge with maxMultiplicity > multiplicity
-> set maxMultiplicity = multiplicity

## Set MaxMulti 1 if remaining degree is 1

Vertex with targetDegree = degree + 1
incident edge with multiplicity 0
and maxMultiplicity = 2
-> maxMultiplicity = 1

## Avoid two vertex islands

Note: These rules are wrong if entire hashi has only two vertex

edge with both vertices having degree 1
-> set maxMulti 0

select vertex with targetDegree 1
incident edge with maxMulti > 0
incident (other) vertex with targetDegree 1
-> set maxMulti 0

edge with both vertices having degree 2
-> set maxMulti 1

# Hashi solved by algorithms

4MaxMultiAlgo = [NeedMaxMultiplicity, NeedAtLeastOneBridgeMaxMulti, SetMaxMultIfRemainingDegreeIs0, SetMaxMultIfRemainingDegreeIs1]

|                | Need2Bridges | NeedAtLeastOneBridge | 4MaxMultiAlgo |
| -------------- | :----------: | :------------------: | :-----------: |
| singleTriangle |              |          x           |       x       |
| doubleTriangle |      x       |          p           |       x       |
| singleSquare   |              |                      |               |
| doubleSquare   |      x       |          p           |       x       |
| singleTee      |              |          x           |       x       |
| doubleTee      |      x       |          p           |       x       |
| singleStar     |              |          x           |       x       |
| doubleStar     |      x       |          p           |       x       |
| singleH        |              |                      |       p       |

# Impossible rules

## Single empty bridge

Vertex with @targetDegree > @degree
and |incident edges with mult 0| = 1
-> set 1 1 bridge on that edge

## General need more bridge rule

Edge with multiplicity < maxMultiplicity
and incident vertex with
@targetDegree = prev's edge @multiplicity + $\Sigma_{other incident edges} maxMultiplicity(e)$
-> addEdge

## Do not close component

Select component with remaining degree 2 (4)
and is not entire hashi
select edge in component with remaining multi 1 (2)
decrease maxMulti

## Do not connect single remaining degree components

Select component with remaining degree 1 (2)
select vertex in component with remaining degree 1 (2)
select edge with remainingMulti 1 (2) (this goes to another component)
select incident other component
with remaining degree 1 (2)
-> decrease maxMulti
