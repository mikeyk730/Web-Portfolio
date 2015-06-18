<?php
use yii\helpers\Html;
if (!isset($user_id)) $user_id = 100;
$groups = app\models\Group::getGroups($user_id);

function addItem($name, $url, $is_selected)
{
    $options = [];
    if ($is_selected){
        $options["class"] = "selected";
    }
    return Html::tag('li', Html::a($name, $url), $options);
}

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
                echo addItem($album->title, ['album/view', 'url_text' => $album->url_text], $album->id == $album_id);
            }
        }
        echo addItem('Blog', ['blog/index'], strcmp('blog', $album_id) == 0);
        //echo addItem('Contact', ['site/contact'], strcmp('contact', $album_id) == 0);
        //echo addItem('About', ['site/about'], strcmp('about', $album_id) == 0);
        ?>
    </ul>
</nav>
