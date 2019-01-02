data "archive_file" "ffprobe" {
  output_path = "bin/ffprobe.zip"

  source_content_filename = "bin/ffprobe"

  type = "zip"
}

data "archive_file" "ffpmeg" {
  output_path             = "bin/ffmpeg.zip"
  source_content_filename = "bin/ffmpeg"
  type                    = "zip"
}

data "archive_file" "graphql" {
  output_path             = "bin/graphql.zip"
  source_content_filename = "bin/graphql"

  type = "zip"
}
