# possible rules

## Need all brides

Vertex with @targetDegree = 2\*|incident edges|
-> set 2 bridges on all incident edges

Edge with degree < 2
and adjacent vertex with
@targetDegree = $\Sigma_{adjacent edges} 2$
-> set 2 bridges

## Need at least one bridge

Vertex with @targetDegree >= 2\*|incident edges| - 1

Edge with mult = 0
and adjacent Vertex with
@targetDegree + 1 >= 2\*|incident edges|
-> set 1 bridge

## Need maxPossible

v with
@targetDegree = $\Sigma_{incident edge e} maxMultiplicity(e)$
-> set maxMultiplicity on all incident edges

Edge with multiplicity < maxMultiplicity
and incident vertex with
@targetDegree = $\Sigma_{adjacent edges} maxMultiplicity(e)$
-> set mult = maxMultiplicity

Equivalent (but more complicated):
Edge with multiplicity < 2
and incident vertex with
@targetDegree +1 < $\Sigma_{other adjacent edges} maxMultiplicity(e)$
-> set mult = 2

## Need at least one bridge due to maxMultiplicity

Edge with multiplicity < maxMultiplicity
and incident vertex with
@targetDegree < $\Sigma_{other adjacent edges} maxMultiplicity(e)$
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

# Impossible rules

## Single empty bridge

Vertex with @targetDegree > @degree
and |incident edges with mult 0| = 1
-> set 1 1 bridge on that edge
