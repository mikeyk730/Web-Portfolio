<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

$display_type = (strcmp($model->type,'tile') == 0) ? 'thumbs' : 'images';

?>
<body class="left nobleed">
    <div id="layout">
        <header>
	    <h1>
                <?= Html::a('<span>{mk}</span>', ['/site/index']); ?>
	    </h1>
	    <nav>
	        <ul>
		    <li><?= Html::a('Places', ['album/view', 'url_text' => 'places']);?></li>
		    <li><?= Html::a('People', ['album/view', 'url_text' => 'people']);?></li>
		    <li><?= Html::a('Wildlife', ['album/view', 'url_text' => 'wildlife']);?></li>
	            <li class="spacer">&nbsp;&nbsp;&nbsp;&nbsp;</li>
		    <li><?= Html::a('Time Travel', ['album/view', 'url_text' => 'time-travel']);?></li>
	        </ul>
	    </nav>
        </header>
        <div id="content">
	    <div class="<?= $model->type ?> native">
	        <ul class="<?= $display_type ?>">
                    <?php foreach($model->photos as $photo) {
                        if(0 == strcmp($display_type, "thumbs")){
                            $img = Html::img($photo->getUrl(400), array(
                                "data-dimensions" => $photo->width."x".$photo->height,
                                "id" => $photo->filename,
                            ));
                            $a = Html::a($img, $photo->getUrl('1600'));
                            echo '<li>'.$a.'</li>';
                        }
                        else{
                            $img = Html::img($photo->getUrl('1600'), array(
                                "data-dimensions" => $photo->width."x".$photo->height,
                                "id" => $photo->filename,
                            ));
                            echo '<li>'.$img.'</li>';
                        }
                    } ?>
	        </ul>
	    </div>
        </div>
        <footer>
            <p class="copyright">&copy; Mike Kaminski</p>
        </footer>
    </div>
</body>
