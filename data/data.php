<?php



$list = array(
        array('value' => 1, 'name' => 'ActionScript'),
        array('value' => 2, 'name' => 'AppleScript'),
        array('value' => 3, 'name' => 'Asp'),
        array('value' => 4, 'name' => 'BASIC'),
        array('value' => 5, 'name' => 'C'),
        array('value' => 6, 'name' => 'C++'),
        array('value' => 7, 'name' => 'Clojure'),
        array('value' => 8, 'name' => 'COBOL'),
        array('value' => 9, 'name' => 'ColdFusion'),
        array('value' => 10, 'name' => 'Erlang'),
        array('value' => 11, 'name' => 'Fortran'),
        array('value' => 12, 'name' => 'Groovy'),
        array('value' => 13, 'name' => 'Haskell'),
        array('value' => 14, 'name' => 'Java'),
        array('value' => 15, 'name' => 'JavaScript'),
        array('value' => 16, 'name' => 'Lisp'),
        array('value' => 17, 'name' => 'Perl'),
        array('value' => 18, 'name' => 'PHP'),
        array('value' => 19, 'name' => 'Python'),
        array('value' => 20, 'name' => 'Ruby'),
        array('value' => 21, 'name' => 'Scala'),
        array('value' => 22, 'name' => 'Scheme'),
    );


$query = isset($_GET['query']) && $_GET['query'] ? $_GET['query'] : true;

$matchs = array();

foreach ($list as $arr) {
    if ($query === true || strpos($arr['name'], $query) !== false) {
        $matchs[] = $arr;
        
        if (count($matchs) >= 10) break;
    }
}

exit(json_encode($matchs));
