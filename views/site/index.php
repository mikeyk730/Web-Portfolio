<?php

use yii\helpers\Html;
?>
<div class="left bleed" id="page-index">
    <div id="layout">
        <header>
	    <h1>
                <?= Html::a('<span>{m.kaminski}</span>', ['/site/index']); ?>
	    </h1>
            <?= $this->render('//album/nav', 
                   ['user_id' => 100, 'album_id' => null]); ?>
        </header>
	<div id="content">
	    <div id="billboard" class="slideshow loading">
		<img class="img" src="/exposed/images/content/1600/IMG_0ihrH53KQXN9L4cAujnt.jpg" alt>
            </div>
	</div>
	<footer>
	    <p class="copyright">&copy; Mike Kaminski</p>
	</footer>
    </div>	            
</div>
