<?php

$list = array(
        array('value' => 1, 'group' => 'G-1', 'name' => 'ActionScript'),
        array('value' => 2, 'group' => 'G-1', 'name' => 'AppleScript'),
        array('value' => 3, 'group' => 'G-1', 'name' => 'Asp'),
        array('value' => 4, 'group' => 'G-1', 'name' => 'BASIC'),
        array('value' => 5, 'group' => 'G-2', 'name' => 'C'),
        array('value' => 6, 'group' => 'G-2', 'name' => 'C++'),
        array('value' => 7, 'group' => 'G-2', 'name' => 'Clojure'),
        array('value' => 8, 'group' => 'G-2', 'name' => 'COBOL'),
        array('value' => 9, 'group' => 'G-2', 'name' => 'ColdFusion'),
        array('value' => 10, 'group' => 'G-3', 'name' => 'Erlang'),
        array('value' => 11, 'group' => 'G-3', 'name' => 'Fortran'),
        array('value' => 12, 'group' => 'G-3', 'name' => 'Groovy'),
        array('value' => 13, 'group' => 'G-3', 'name' => 'Haskell'),
        array('value' => 14, 'group' => 'G-3', 'name' => 'Java'),
        array('value' => 15, 'group' => 'G-3', 'name' => 'JavaScript'),
        array('value' => 16, 'group' => 'G-3', 'name' => 'Lisp'),
        array('value' => 17, 'group' => 'G-3', 'name' => 'Perl'),
        array('value' => 18, 'group' => 'G-3', 'name' => 'PHP'),
        array('value' => 19, 'name' => 'Python'),
        array('value' => 20, 'name' => 'Ruby'),
        array('value' => 21, 'name' => 'Scala'),
        array('value' => 22, 'name' => 'Scheme'),
    );


$query = isset($_GET['query']) && $_GET['query'] ? $_GET['query'] : true;

$matchs = array();
foreach ($list as $arr) {
    if (isset($arr['group'])) {
        if (! isset($matchs[$arr['group']])){
            $matchs[$arr['group']] = array(
                    'is_optgroup' => true,
                    'label' => $arr['group'],
                    'options' => array()
                );
        }
        $matchs[$arr['group']]['options'][] = $arr;
    } else {
        $matchs[] = $arr;
    }
}
sleep(2);
// exit('<pre>' . print_r($matchs, true));
exit(json_encode(array_values($matchs)));
