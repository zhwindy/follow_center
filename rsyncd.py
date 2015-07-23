#!/usr/bin/env python
# -*- coding: utf-8 -*-

import twitter
import github
import time

if __name__ == '__main__':
    while True:
        twitter.check()
        github.check()
        time.sleep(300)
