#!/usr/bin/env python
# -*- coding: utf-8 -*-

from ui_module import base_m


class my_base(base_m.base_m):

    '''
    create by bigzhu at 15/08/06 15:32:30 为了自定义自已的js
    modify by bigzhu at 15/08/20 09:58:41 add layzr.min.js
    create by bigzhu at 15/08/20 10:49:20 没有用，删了
    '''

    def javascript_files(self):
        self.all_js_files = super(my_base, self).javascript_files()

        simditor_path = self.LIB_PATH + 'simditor-2.1.14/'
        simditor_script = simditor_path + 'scripts/'
        simditor_js_files = [
            simditor_script + 'module.js',
            simditor_script + 'hotkeys.js',
            simditor_script + 'uploader.js',
            simditor_script + 'simditor.js',
        ]
        self.all_js_files += simditor_js_files

        #self.all_js_files.append('component.js')
        self.all_js_files.append('director.min.js')
        #self.all_js_files.append('GreenSock-JS/src/minified/TimelineLite.min.js')
        return self.all_js_files

if __name__ == '__main__':
    pass
