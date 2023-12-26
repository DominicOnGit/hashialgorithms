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

# Impossible rules

## Single empty bridge

Vertex with @targetDegree > @degree
and |incident edges with mult 0| = 1
-> set 1 1 bridge on that edge
