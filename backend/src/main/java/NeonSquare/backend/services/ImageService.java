package NeonSquare.backend.services;

import NeonSquare.backend.models.Image;
import NeonSquare.backend.repositories.ImageRepository;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class ImageService {

    private final ImageRepository repository;
    private final Tika tika = new Tika();

    @Autowired
    public ImageService(ImageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Image saveImage(MultipartFile file) throws IOException {
        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setData(file.getBytes());
        String mimeType = tika.detect(file.getBytes());
        image.setType(mimeType);

        return repository.save(image);
    }

    public Image getImage(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Image not found"));
    }

    @Transactional
    public Image updateImage(MultipartFile file, UUID imageId) throws IOException {
        Image image = repository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        image.setName(file.getOriginalFilename());
        image.setData(file.getBytes());
        return repository.save(image);
    }

    @Transactional
    public void deleteImage(UUID imageId) throws IOException {
        Image image = repository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        repository.delete(image);
    }
}
