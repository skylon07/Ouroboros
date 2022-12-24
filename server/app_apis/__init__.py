from .console.ConsoleApi import ConsoleApi
from .tic_tac_toe.TicTacToeApi import TicTacToeApi
from .l_game.LGameApi import LGameApi
from .dots_and_boxes.DotsAndBoxesApi import DotsAndBoxesApi

apis_by_path = {
    '/console': ConsoleApi(),
    '/tic-tac-toe': TicTacToeApi(),
    '/l-game': LGameApi(),
    '/dots-and-boxes': DotsAndBoxesApi(),
}