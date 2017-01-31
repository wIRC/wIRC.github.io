// touch events

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener("DOMContentLoaded", function () {
    var switchbar = document.getElementById('switchbar');
    var nicklist = document.getElementById('nicklist');
    if (screen.width < 500) {
        switchbar.style.display = 'none';
        nicklist.style.display = 'none';
    }
});

var xDown = null;
var yDown = null;
var leftState = false;
var rightState = false;


function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        var switchbar = document.getElementById('switchbar');
        var nicklist = document.getElementById('nicklist');
        // left
        if (xDiff > 0) {
            BS.log('left', xDiff, yDiff, xDown / $(document).width());
            if (xDown / $(document).width() > .85) {
                nicklist.style.display = '';
            }
            else if (xDown / $(document).width() < .40) {
                switchbar.style.display = 'none';
            }
            // right
        } else {
            BS.log('right', xDiff, yDiff, xDown / $(document).width());
            if (xDown / $(document).width() > .60) {
                nicklist.style.display = 'none';
            }
            else if (xDown / $(document).width() < .15) {
                switchbar.style.display = '';
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    }
}
