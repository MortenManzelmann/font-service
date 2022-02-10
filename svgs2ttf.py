import sys
import os.path
import json
import fontforge

IMPORT_OPTIONS = ('removeoverlap', 'correctdir')

try:
    unicode
except NameError:
    unicode = str

def loadConfig(filename='font.json'):
    with open(filename) as f:
        return json.load(f)

def setProperties(font, config):
    lang =  'English (US)'
    family = 'Example' 
    style = 'Regular'
    props['encoding'] = props.get('encoding', 'UnicodeFull')
    if family is not None:
        font.familyname = family
        font.fontname = family + '-' + style
        font.fullname = family + ' ' + style
    for k, v in config['props'].items():
        if hasattr(font, k):
            if isinstance(v, list):
                v = tuple(v)
            setattr(font, k, v)
        else: 
            font.appendSFNTName(lang, k, v)
    for t in config.get('sfnt_names', []):
        font.appendSFNTName(str(t[0]), str(t[1]), unicode(t[2]))

def addGlyphs(font, config):
    for key, value in config['glyphs'].items():
        glyph = font.createMappedChar(int(key, 0))
        # Get outlines
        src = '%s.svg' % key
        if not isinstance(value, dict):
            value = {'src': value or src}
        src = '%s%s%s' % (config.get('input', '.'), os.path.sep, value.pop('src', src))
        glyph.importOutlines(src)
        glyph.left_side_bearing = 0
        glyph.right_side_bearing = 20
        for k2, v2 in value.items():
            if hasattr(glyph, k2):
                if isinstance(v2, list):
                    v2 = tuple(v2)
                setattr(glyph, k2, v2)

def main(config_file):
    config = loadConfig(config_file)
    os.chdir(os.path.dirname(config_file) or '.')
    font = fontforge.font()

    # setProperties(font, config)
    addGlyphs(font, config)
    for outfile in config['output']:
        sys.stderr.write('Generating %s...\n' % outfile)
        font.generate(outfile)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        sys.stderr.write("\nUsage: %s something.json\n" % sys.argv[0] )

