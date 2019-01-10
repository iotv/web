// Code generated by vfsgen; DO NOT EDIT.

// +build !dev

package schema

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	pathpkg "path"
	"time"
)

// Assets statically implements the virtual filesystem provided to vfsgen.
var Assets = func() http.FileSystem {
	fs := vfsgen۰FS{
		"/": &vfsgen۰DirInfo{
			name:    "/",
			modTime: time.Date(2018, 12, 3, 6, 52, 55, 271935619, time.UTC),
		},
		"/schema.graphql": &vfsgen۰CompressedFileInfo{
			name:             "schema.graphql",
			modTime:          time.Date(2018, 12, 3, 6, 52, 55, 268741827, time.UTC),
			uncompressedSize: 717,

			compressedContent: []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\xa4\x52\xbb\x4e\xc4\x30\x10\xec\xfd\x15\x9b\x0e\x7e\xc1\xdd\x71\x80\x44\x01\x02\x9d\x02\x05\xa2\xb0\xe2\xe5\x62\xe1\x78\x83\x1f\x8a\x22\x74\xff\x8e\xec\x38\xc1\xe1\x42\xc5\x35\x97\xcc\xcc\xee\xcc\x8e\xe2\x9a\x16\x3b\x01\x5f\x0c\x00\xe0\x33\xa0\x1d\x39\x3c\xc5\xbf\x04\x74\xc1\x0b\xaf\xc8\x70\xb8\xcf\x4f\xec\xc4\x98\x1f\x7b\x9c\x44\x79\xae\x43\x0e\xb5\x43\x5b\x2d\xec\x2c\xcf\x82\xc6\xa2\xf0\x78\xa0\x60\x1b\x7c\x56\x12\x89\x43\xf1\x52\x15\x9a\xb8\xe6\x45\xf9\xf6\x51\x38\x37\x90\x95\x17\x89\x8b\x3f\xec\x84\xd2\x1c\x0e\xde\x2a\x73\xac\x16\xb8\xcf\xc2\x73\x26\x38\xb4\x0f\x22\x66\x2b\x99\xcb\x29\xea\x2e\xf8\x76\x4f\xc6\x0b\x65\x62\xee\xc8\x68\x3a\x2a\x13\xbd\x6f\xa2\xd3\xce\xc8\x7f\x66\xd8\x76\x9a\x1b\x2a\xee\xcf\x25\x29\xc9\xe1\xee\x7a\x9a\x55\xee\x36\x68\x3d\xd6\xbd\x26\x21\x51\x72\xb8\x22\xd2\x28\xcc\xc4\xd2\x60\xd0\xc6\xdd\x93\x43\xc2\x42\x92\xd6\x76\x89\x97\x50\x49\x83\xf9\x8d\xcf\x09\xe2\xe8\x86\xf5\xc6\x8d\xca\xa5\x4a\xf6\x64\xde\x95\xed\xce\xe2\x58\x14\xba\x2c\x9a\xfd\xdd\xbe\xfb\xb9\xda\x71\x78\x2d\x3f\x82\xb7\x6a\x95\x6c\x55\x5b\x8e\xe9\xe9\x03\xcd\x7a\x61\x58\x5a\xa8\xd8\xe9\x3b\x00\x00\xff\xff\x26\xf3\xa5\xc7\xcd\x02\x00\x00"),
		},
	}
	fs["/"].(*vfsgen۰DirInfo).entries = []os.FileInfo{
		fs["/schema.graphql"].(os.FileInfo),
	}

	return fs
}()

type vfsgen۰FS map[string]interface{}

func (fs vfsgen۰FS) Open(path string) (http.File, error) {
	path = pathpkg.Clean("/" + path)
	f, ok := fs[path]
	if !ok {
		return nil, &os.PathError{Op: "open", Path: path, Err: os.ErrNotExist}
	}

	switch f := f.(type) {
	case *vfsgen۰CompressedFileInfo:
		gr, err := gzip.NewReader(bytes.NewReader(f.compressedContent))
		if err != nil {
			// This should never happen because we generate the gzip bytes such that they are always valid.
			panic("unexpected error reading own gzip compressed bytes: " + err.Error())
		}
		return &vfsgen۰CompressedFile{
			vfsgen۰CompressedFileInfo: f,
			gr:                        gr,
		}, nil
	case *vfsgen۰DirInfo:
		return &vfsgen۰Dir{
			vfsgen۰DirInfo: f,
		}, nil
	default:
		// This should never happen because we generate only the above types.
		panic(fmt.Sprintf("unexpected type %T", f))
	}
}

// vfsgen۰CompressedFileInfo is a static definition of a gzip compressed file.
type vfsgen۰CompressedFileInfo struct {
	name              string
	modTime           time.Time
	compressedContent []byte
	uncompressedSize  int64
}

func (f *vfsgen۰CompressedFileInfo) Readdir(count int) ([]os.FileInfo, error) {
	return nil, fmt.Errorf("cannot Readdir from file %s", f.name)
}
func (f *vfsgen۰CompressedFileInfo) Stat() (os.FileInfo, error) { return f, nil }

func (f *vfsgen۰CompressedFileInfo) GzipBytes() []byte {
	return f.compressedContent
}

func (f *vfsgen۰CompressedFileInfo) Name() string       { return f.name }
func (f *vfsgen۰CompressedFileInfo) Size() int64        { return f.uncompressedSize }
func (f *vfsgen۰CompressedFileInfo) Mode() os.FileMode  { return 0444 }
func (f *vfsgen۰CompressedFileInfo) ModTime() time.Time { return f.modTime }
func (f *vfsgen۰CompressedFileInfo) IsDir() bool        { return false }
func (f *vfsgen۰CompressedFileInfo) Sys() interface{}   { return nil }

// vfsgen۰CompressedFile is an opened compressedFile instance.
type vfsgen۰CompressedFile struct {
	*vfsgen۰CompressedFileInfo
	gr      *gzip.Reader
	grPos   int64 // Actual gr uncompressed position.
	seekPos int64 // Seek uncompressed position.
}

func (f *vfsgen۰CompressedFile) Read(p []byte) (n int, err error) {
	if f.grPos > f.seekPos {
		// Rewind to beginning.
		err = f.gr.Reset(bytes.NewReader(f.compressedContent))
		if err != nil {
			return 0, err
		}
		f.grPos = 0
	}
	if f.grPos < f.seekPos {
		// Fast-forward.
		_, err = io.CopyN(ioutil.Discard, f.gr, f.seekPos-f.grPos)
		if err != nil {
			return 0, err
		}
		f.grPos = f.seekPos
	}
	n, err = f.gr.Read(p)
	f.grPos += int64(n)
	f.seekPos = f.grPos
	return n, err
}
func (f *vfsgen۰CompressedFile) Seek(offset int64, whence int) (int64, error) {
	switch whence {
	case io.SeekStart:
		f.seekPos = 0 + offset
	case io.SeekCurrent:
		f.seekPos += offset
	case io.SeekEnd:
		f.seekPos = f.uncompressedSize + offset
	default:
		panic(fmt.Errorf("invalid whence value: %v", whence))
	}
	return f.seekPos, nil
}
func (f *vfsgen۰CompressedFile) Close() error {
	return f.gr.Close()
}

// vfsgen۰DirInfo is a static definition of a directory.
type vfsgen۰DirInfo struct {
	name    string
	modTime time.Time
	entries []os.FileInfo
}

func (d *vfsgen۰DirInfo) Read([]byte) (int, error) {
	return 0, fmt.Errorf("cannot Read from directory %s", d.name)
}
func (d *vfsgen۰DirInfo) Close() error               { return nil }
func (d *vfsgen۰DirInfo) Stat() (os.FileInfo, error) { return d, nil }

func (d *vfsgen۰DirInfo) Name() string       { return d.name }
func (d *vfsgen۰DirInfo) Size() int64        { return 0 }
func (d *vfsgen۰DirInfo) Mode() os.FileMode  { return 0755 | os.ModeDir }
func (d *vfsgen۰DirInfo) ModTime() time.Time { return d.modTime }
func (d *vfsgen۰DirInfo) IsDir() bool        { return true }
func (d *vfsgen۰DirInfo) Sys() interface{}   { return nil }

// vfsgen۰Dir is an opened dir instance.
type vfsgen۰Dir struct {
	*vfsgen۰DirInfo
	pos int // Position within entries for Seek and Readdir.
}

func (d *vfsgen۰Dir) Seek(offset int64, whence int) (int64, error) {
	if offset == 0 && whence == io.SeekStart {
		d.pos = 0
		return 0, nil
	}
	return 0, fmt.Errorf("unsupported Seek in directory %s", d.name)
}

func (d *vfsgen۰Dir) Readdir(count int) ([]os.FileInfo, error) {
	if d.pos >= len(d.entries) && count > 0 {
		return nil, io.EOF
	}
	if count <= 0 || count > len(d.entries)-d.pos {
		count = len(d.entries) - d.pos
	}
	e := d.entries[d.pos : d.pos+count]
	d.pos += count
	return e, nil
}