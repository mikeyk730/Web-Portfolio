<?php
use yii\helpers\Html;

$groups = app\models\Group::getGroups($user_id);
?>

<nav>
    <ul>
        <?php 
        $first = true;
        foreach($groups as $group){
            if ($group->title){
                echo Html::tag('li', $group->title);
            }
            else if (!$first){
                echo Html::tag('li', "&nbsp;&nbsp;&nbsp;&nbsp;", ["class"=>"spacer"]);
            }
            $first = false;
            foreach($group->albums as $album){
                $options = [];
                if ($album->id == $album_id){
                    $options["class"] = "selected";
                }
                $a = Html::a($album->title, ['album/view', 'url_text' => $album->url_text]);
                echo Html::tag('li', $a, $options);
            }
        }
        $a = Html::a('Blog', ['blog/index']);
        echo Html::tag('li', $a);
        ?>
    </ul>
</nav>
