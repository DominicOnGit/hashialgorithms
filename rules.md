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

# Hashi solved by single rule

|                | Need2Bridges | NeedAtLeastOneBridge |
| -------------- | :----------: | :------------------: |
| singleTriangle |              |          x           |
| doubleTriangle |      x       |          p           |
| singleSquare   |              |                      |
| doubleSquare   |      x       |          p           |
| singleTee      |              |          x           |
| doubleTee      |      x       |          p           |
| singleStar     |              |          x           |
| doubleStar     |      x       |          p           |

# Impossible rules

## Single empty bridge

Vertex with @targetDegree > @degree
and |incident edges with mult 0| = 1
-> set 1 1 bridge on that edge
