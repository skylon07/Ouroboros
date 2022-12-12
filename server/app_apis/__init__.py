from .console.ConsoleApi import ConsoleApi
from .l_game.LGameApi import LGameApi

apis_by_path = {
    '/console': ConsoleApi(),
    '/l-game': LGameApi(),
}