#!/usr/bin/env python
# -*- coding: utf-8 -*-

from ui_module import base_m


class my_base(base_m.base_m):

    '''
    create by bigzhu at 15/08/06 15:32:30 为了自定义自已的js
    '''

    def javascript_files(self):
        all_js_files = super(my_base, self).javascript_files()
        self.all_js_files.append('/static/component.js')
        self.all_js_files.append('/static/director.js')
        self.all_js_files.append('/static/GreenSock-JS/src/minified/TimelineLite.min.js')
        return all_js_files
if __name__ == '__main__':
    pass
