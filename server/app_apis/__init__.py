from .console.ConsoleApi import ConsoleApi
from .l_game.LGameApi import LGameApi
from .dots_and_boxes.DotsAndBoxesApi import DotsAndBoxesApi

apis_by_path = {
    '/console': ConsoleApi(),
    '/l-game': LGameApi(),
    '/dots-and-boxes': DotsAndBoxesApi(),
}