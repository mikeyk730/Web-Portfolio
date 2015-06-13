<?php

use yii\helpers\Html;
?>
<body class="left bleed" id="page-index">
    <div id="layout">
        <header>
	    <h1>
                <?= Html::a('<span>{m.kaminski}</span>', ['/site/index']); ?>
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
	    <div id="billboard" class="slideshow loading">
		<img class="img" src="/exposed/images/content/1600/IMG_0ihrH53KQXN9L4cAujnt.jpg" alt>
            </div>
	</div>
	<footer>
	    <p class="copyright">&copy; Mike Kaminski</p>
	</footer>
    </div>	            
</body>
