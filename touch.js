// touch events
var switchbar;
var nicklist;

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener("DOMContentLoaded", function () {
    switchbar = document.getElementById('switchbar');
    nicklist = document.getElementById('nicklist');
    updateScreenSize();

    switchbar.addEventListener('mouseleave', function (e) {
        if (innerWidth < 500) {
            switchbar.style.display = 'none';
        }
    });
    nicklist.addEventListener('mouseleave', function (e) {
        if (innerWidth < 500) {
            nicklist.style.display = 'none';
        }
    });

});
addEventListener("resize", updateScreenSize);

function updateScreenSize() {
    if (innerWidth < 500) {
        switchbar.style.display = 'none';
        nicklist.style.display = 'none';
    }
    else {
        switchbar.style.display = '';
        nicklist.style.display = '';
    }
}


var xDown = null;
var yDown = null;


function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        // left
        if (xDiff > 0) {
            BS.log('left', xDiff, yDiff, xDown / innerWidth);
            if (xDown / innerWidth > .85) {
                nicklist.style.display = '';
            }
            else if (xDown / innerWidth < .40) {
                switchbar.style.display = 'none';
            }
            // right
        } else {
            BS.log('right', xDiff, yDiff, xDown / innerWidth);
            if (xDown / innerWidth > .60) {
                nicklist.style.display = 'none';
            }
            else if (xDown / innerWidth < .15) {
                switchbar.style.display = '';
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    }
}

addEventListener('mousemove', function (e) {
    if (e.clientX < innerWidth * 0.05) {
        switchbar.style.display = '';
    }
    if (e.clientX > innerWidth * 0.95) {
        nicklist.style.display = '';
    }
});
