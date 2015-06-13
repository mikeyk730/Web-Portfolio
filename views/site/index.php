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
	            <li class="places"><?= Html::a('Places', ['/album/view?id=1']); ?></li>
	            <li class="people "><?= Html::a('People', ['/album/view?id=2']); ?></li>
	            <li class="wildlife "><?= Html::a('Wildlife', ['/album/view?id=3']); ?></li>
	            <li class="spacer">&nbsp;&nbsp;&nbsp;&nbsp;</li>
	            <li class="time-travel "><?= Html::a('Time Travel', ['/album/view?id=4']); ?></li>
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
